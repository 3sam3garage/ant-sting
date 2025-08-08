import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { PortfolioRepository } from '@libs/domain-mongo';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { Notify13fMessage, PortfolioItem } from '../interface';
import { ObjectId } from 'mongodb';
import { Logger } from '@nestjs/common';
import { Dictionary, groupBy } from 'lodash';
import {
  from13FtoSlackMessage,
  SlackApi,
  SlackMessageBlock,
} from '@libs/external-api';

@Processor(QUEUE_NAME.NOTIFY_13F)
export class Notify13fConsumer extends BaseConsumer {
  constructor(
    private readonly portfolioRepo: PortfolioRepository,
    private readonly slackApi: SlackApi,
  ) {
    super();
  }

  private buildLoneMessageBlock(
    cusips: string[],
    groupedItems: Dictionary<PortfolioItem[]>,
  ) {
    const blocks: SlackMessageBlock[] = [];

    const items = cusips
      .map((cusip) => groupedItems?.[cusip]?.[0])
      .sort((a, b) => {
        return b?.portion - a?.portion; // 내림차순 정렬
      });

    for (const item of items.slice(0, 10)) {
      const { shareAmount, value, portion, name, cusip } = item;
      blocks.push(
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                {
                  type: 'text',
                  text: `${name} (cusip: ${cusip})`,
                  style: { bold: true },
                },
              ],
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

  @Process({ concurrency: 1 })
  async run({ data: { _id, issuer } }: Job<Notify13fMessage>) {
    const [portfolio, prevPortfolio] = await Promise.all([
      this.portfolioRepo.findOne({ where: new ObjectId(_id) }),
      this.portfolioRepo.findOne({
        where: { issuer, _id: { $lt: new ObjectId(_id) } },
      }),
    ]);

    switch (true) {
      case !portfolio:
        Logger.error('포트폴리오를 찾을 수 없습니다.');
        return;
      case !prevPortfolio:
        Logger.error('이전 포트폴리오를 찾을 수 없습니다.');
        return;
    }

    const newSet = new Set(portfolio.items.map((item) => item.cusip));
    const removedSet = new Set(prevPortfolio.items.map((item) => item.cusip));
    for (const cusip of [...newSet]) {
      const currentIncludes = newSet.has(cusip);
      const prevIncludes = removedSet.has(cusip);
      if (currentIncludes && prevIncludes) {
        newSet.delete(cusip);
        removedSet.delete(cusip);
      }
    }

    const groupedItems = groupBy(
      [...prevPortfolio.items, ...portfolio.items],
      'cusip',
    );

    // slack message
    const blockArray: SlackMessageBlock[][] = [
      this.buildLoneMessageBlock([...newSet], groupedItems),
      this.buildLoneMessageBlock([...removedSet], groupedItems),
    ];

    const message = from13FtoSlackMessage(
      `${portfolio.issuer} (${prevPortfolio.date} -> ${portfolio.date})`,
      blockArray,
    );

    await this.slackApi.sendMessage(message).catch((error) => {
      Logger.error(error);
    });
  }
}
