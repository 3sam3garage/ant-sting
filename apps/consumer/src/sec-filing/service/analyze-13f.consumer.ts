import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
  AnalyzeSec13fMessage,
  Portfolio as PortfolioEntity,
  PortfolioRepository,
} from '@libs/domain-mongo';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import {
  InvestmentInfo,
  InvestmentItem,
  Portfolio,
  PortfolioItem,
} from '../../../../batch/src/poc/interface';
import { groupBy } from 'lodash';
import { parseStringPromise } from 'xml2js';
import { ChromiumService } from '@libs/browser';
import { SecApiService } from '@libs/external-api';
import { format } from 'date-fns';

@Processor(QUEUE_NAME.ANALYZE_13F)
export class Analyze13fConsumer extends BaseConsumer {
  constructor(
    private readonly chromiumService: ChromiumService,
    private readonly portfolioRepo: PortfolioRepository,
    private readonly secApi: SecApiService,
    @InjectQueue(QUEUE_NAME.NOTIFY_13F)
    private readonly queue: Queue,
  ) {
    super();
  }

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
        portion: parseFloat(portion.toFixed(3)),
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

  @Process({ concurrency: 1 })
  async run({ data: { url } }: Job<AnalyzeSec13fMessage>) {
    const cik = url.split('/')[6];

    const { name, items: infos } = await this.figure13_HRUrls(cik);
    const investmentInfos: InvestmentInfo[] = [];
    for (const info of infos.slice(0, 2)) {
      const url = info.url;
      const items = await this.figureInvestments(url);
      investmentInfos.push({ items, url, date: info.date });
    }

    // new, removed
    const [current, prev] = investmentInfos;
    const curPortfolio = this.figurePortfolio(current);
    const prevPortfolio = this.figurePortfolio(prev);

    // DB에 저장
    for (const entity of [
      PortfolioEntity.create({ issuer: name, ...curPortfolio }),
      PortfolioEntity.create({ issuer: name, ...prevPortfolio }),
    ]) {
      const prevEntity = await this.portfolioRepo.findOne({
        where: { url: entity.url },
      });

      if (!prevEntity) {
        const result = await this.portfolioRepo.save(entity);
        if (result.date === format(new Date(), 'yyyy-MM-dd')) {
          await this.queue.add({ _id: result._id });
        }
      }
    }
  }
}
