import { Injectable, Logger } from '@nestjs/common';
import {
  from13FtoSlackMessage,
  SecApiService,
  SlackApi,
  SlackMessageBlock,
} from '@libs/external-api';
import { ChromiumService } from '@libs/browser';
import {
  InvestmentInfo,
  InvestmentItem,
  Portfolio,
  PortfolioItem,
} from '../interface';
import { Dictionary, groupBy, remove } from 'lodash';
import { parseStringPromise } from 'xml2js';
import { InvestmentRedisRepository } from '@libs/domain-redis';

@Injectable()
export class Sec13fTask {
  constructor(
    private readonly secApi: SecApiService,
    private readonly chromiumService: ChromiumService,
    private readonly slackApi: SlackApi,
    private readonly investmentRedisRepo: InvestmentRedisRepository,
  ) {}

  private async figure13_HRUrls(cik: string) {
    const submissions = await this.secApi.fetchSubmission(cik);
    if (!submissions) {
      return;
    }

    const {
      name,
      filings: {
        recent: { accessionNumber = [], form = [], filingDate = [] },
      },
    } = submissions;

    const items: { url: string; date: string }[] = [];
    for (const [index, value] of Object.entries(form)) {
      if (value === '13F-HR') {
        const name = accessionNumber[index];
        const date = filingDate[index];

        items.push({
          url: `https://www.sec.gov/Archives/edgar/data/${cik}/${name.replaceAll('-', '')}/${name}.txt`,
          date,
        });
      }
    }

    return { name, items };
  }

  private figurePortfolio({
    url,
    date,
    items: investmentItems,
  }: InvestmentInfo): Portfolio {
    const grouped = groupBy(investmentItems, 'cusip');

    const nameMap = new Map<string, string>();
    let totalValue = 0;
    for (const investmentItem of investmentItems) {
      const { cusip, value, nameOfIssuer } = investmentItem;
      totalValue += +value;
      nameMap.set(cusip, nameOfIssuer);
    }

    const items: PortfolioItem[] = [];
    for (const [cusip, investments] of Object.entries(grouped)) {
      const value = investments.reduce((acc, item) => {
        return acc + (+item.value || 0);
      }, 0);
      const shareAmount = investments.reduce((acc, item) => {
        return (acc += +(item?.shrsOrPrnAmt?.sshPrnamt || 0));
      }, 0);

      const portion = (value / totalValue) * 100;

      items.push({
        shareAmount,
        date,
        name: nameMap.get(cusip),
        cusip,
        value,
        portion: parseFloat(portion.toFixed(2)),
      });
    }

    return {
      url,
      date,
      totalValue,
      items,
    };
  }

  async figureInvestments(url: string) {
    const page = await this.chromiumService.getPage();

    await page.goto(url);

    const text = await page.evaluate(() => {
      return document.querySelector('pre').innerText;
    });

    const [match] = text
      .replaceAll('ns1:', '')
      .match(/<informationTable[^>]*>([\s\S]*?)<\/informationTable>/);

    const parsed: { informationTable: { infoTable: InvestmentItem[] } } =
      await parseStringPromise(match, {
        trim: true,
        explicitArray: false,
        emptyTag: () => null,
      });
    const investmentItems = parsed.informationTable?.infoTable || [];

    return investmentItems;
  }

  private buildLoneMessageBlock(
    cusips: string[],
    groupedItems: Dictionary<PortfolioItem[]>,
  ) {
    const blocks: SlackMessageBlock[] = [];

    for (const cusip of cusips) {
      const [item] = groupedItems[cusip];
      const { shareAmount, value, portion, name } = item;
      blocks.push(
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_section',
              elements: [{ type: 'text', text: name, style: { bold: true } }],
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `- *shareAmount* : \`${shareAmount.toLocaleString()}\``,
            },
            {
              type: 'mrkdwn',
              text: `- *value*: \`\$${value.toLocaleString()}\``,
            },
            { type: 'mrkdwn', text: `- *portion*: \`${portion} %\`` },
          ],
        },
      );
      delete groupedItems[cusip];
    }

    return blocks;
  }

  private buildDifferenceMessageBlock(
    groupedItems: Dictionary<PortfolioItem[]>,
  ): SlackMessageBlock[] {
    const blocks: SlackMessageBlock[] = [];
    for (const [, portfolioItems] of Object.entries(groupedItems)) {
      const [prev, current] = portfolioItems;
      blocks.push(
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                { type: 'text', text: prev.name, style: { bold: true } },
              ],
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `- *shareAmount* : \`${prev.shareAmount.toLocaleString()} -> ${current.shareAmount.toLocaleString()}\``,
            },
            {
              type: 'mrkdwn',
              text: `- *value*: \`\$${prev.value.toLocaleString()} -> \$${current.value.toLocaleString()}\``,
            },
            {
              type: 'mrkdwn',
              text: `- *portion*: \`${prev.portion} % -> ${current.portion} %\``,
            },
          ],
        },
      );
    }

    return blocks;
  }

  /**
   * @todo
   * 1. portion 이 높은 순으로 각각 10개씩. 나머지는 생략.
   * 2. 신규, 청산 수는 레디스에 집계. (추후 1주일에 한번씩 상위 하위 알림 배치 예정)
   */
  async exec() {
    const path =
      'https://www.sec.gov/Archives/edgar/data/1940917/000194091725000004/0001940917-25-000004-index.htm';
    const cik = path.split('/')[6];

    const { name, items: infos } = await this.figure13_HRUrls(cik);
    const investmentInfos: InvestmentInfo[] = [];
    for (const info of infos.slice(0, 2)) {
      const url = info.url;
      const items = await this.figureInvestments(url);
      investmentInfos.push({ items, url, date: info.date });
    }

    const [current, prev] = investmentInfos;
    const curPortfolio = this.figurePortfolio(current);
    const prevPortfolio = this.figurePortfolio(prev);

    const newSet = new Set(current.items.map((item) => item.cusip));
    const removedSet = new Set(prev.items.map((item) => item.cusip));
    for (const cusip of [...newSet]) {
      const currentIncludes = newSet.has(cusip);
      const prevIncludes = removedSet.has(cusip);
      if (currentIncludes && prevIncludes) {
        newSet.delete(cusip);
        removedSet.delete(cusip);
      }
    }

    const groupedItems = groupBy(
      [...prevPortfolio.items, ...curPortfolio.items],
      'cusip',
    );
    for (const cusip of [...newSet]) {
      const item = groupedItems[cusip]?.[0];
      if (!item) {
        continue;
      }
      await this.investmentRedisRepo.addAcquisitionCount(cusip, item.name);
    }
    for (const cusip of [...removedSet]) {
      const item = groupedItems[cusip]?.[0];
      if (!item) {
        continue;
      }
      await this.investmentRedisRepo.addDivestmentCount(cusip, item.name);
    }

    // block
    const blockArray: SlackMessageBlock[][] = [
      this.buildLoneMessageBlock([...newSet], groupedItems),
      this.buildLoneMessageBlock([...removedSet], groupedItems),
      // this.buildDifferenceMessageBlock(groupedItems),
    ];

    const message = from13FtoSlackMessage(
      `${name} (${prevPortfolio.date} -> ${curPortfolio.date})`,
      blockArray,
    );

    // await this.slackApi.sendMessage(message).catch((error) => {
    //   Logger.error(error);
    // });
  }
}
