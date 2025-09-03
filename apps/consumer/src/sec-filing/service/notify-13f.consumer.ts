import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { PortfolioItem, PortfolioRepository } from '@libs/infrastructure/mongo';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { ObjectId } from 'mongodb';
import { Inject, Logger } from '@nestjs/common';
import { Dictionary } from 'lodash';
import { SlackApi, SlackMessageBlock } from '@libs/infrastructure/external-api';
import { Notify13fMessage } from '@libs/core';
import { Portfolio, PortfolioRepositoryImpl } from '@libs/domain';

@Processor(QUEUE_NAME.NOTIFY_13F)
export class Notify13fConsumer extends BaseConsumer {
  constructor(
    @Inject(PortfolioRepository)
    private readonly portfolioRepo: PortfolioRepositoryImpl,
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
      this.portfolioRepo.findOneById(new ObjectId(_id)),
      this.portfolioRepo.findOnePreviousByIdAndIssuer(
        new ObjectId(_id),
        issuer,
      ),
    ]);

    switch (true) {
      case !portfolio:
        Logger.error('포트폴리오를 찾을 수 없습니다.');
        return;
      case !prevPortfolio:
        Logger.error('이전 포트폴리오를 찾을 수 없습니다.');
        return;
    }

    const { added, removed } = Portfolio.figureAddedAndRemoved(
      portfolio,
      prevPortfolio,
    );

    console.log(added, removed);

    // slack message
    // const blockArray: SlackMessageBlock[][] = [
    //   this.buildLoneMessageBlock([...newSet], groupedItems),
    //   this.buildLoneMessageBlock([...removedSet], groupedItems),
    // ];
    //
    // const message = from13FtoSlackMessage(
    //   `${portfolio.issuer} (${prevPortfolio.date} -> ${portfolio.date})`,
    //   blockArray,
    // );
    //
    // await this.slackApi.sendMessage(message).catch((error) => {
    //   Logger.error(error);
    // });
  }
}
