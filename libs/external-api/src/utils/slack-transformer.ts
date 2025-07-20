import { EconomicInformationAnalysis } from '@libs/domain-mongo';
import { SlackMessage, SlackMessageBlock } from '../intefaces';

export const fromEconomicInfoToSlackMessage = (
  economicInfoAnalysis: EconomicInformationAnalysis,
): SlackMessage => {
  const { questions, insights, terminologies, summaries, strategies } =
    economicInfoAnalysis;

  const summaryElements = summaries.map((summary) => {
    return {
      type: 'rich_text_section',
      elements: [{ type: 'text', text: summary, style: { bold: true } }],
    };
  }) as SlackMessageBlock[];
  const insightsElements = insights.map((summary) => {
    return {
      type: 'rich_text_section',
      elements: [{ type: 'text', text: summary, style: { bold: true } }],
    };
  }) as SlackMessageBlock[];
  const termsElements = terminologies.map((term) => {
    return {
      type: 'rich_text_section',
      elements: [{ type: 'text', text: term }],
    };
  }) as SlackMessageBlock[];
  const questionsElements = questions.map(({ question, answer }) => {
    return {
      type: 'rich_text_quote',
      elements: [
        { type: 'text', text: `Q. ${question}`, style: { bold: true } },
        { type: 'text', text: '\n' },
        { type: 'text', text: `A. ${answer}` },
        { type: 'text', text: '\n\n' },
      ],
    };
  }) as SlackMessageBlock[];
  const strategyElements = strategies.map(({ action, reason }) => {
    return {
      type: 'rich_text_quote',
      elements: [
        { type: 'text', text: `- ${action}`, style: { bold: true } },
        { type: 'text', text: '\n' },
        { type: 'text', text: `${reason}` },
        { type: 'text', text: '\n\n' },
      ],
    };
  }) as SlackMessageBlock[];

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Daily digest' },
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: summaryElements,
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Insights' },
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: insightsElements,
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Questions you might have...' },
      },
      {
        type: 'rich_text',
        elements: questionsElements,
      },
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Market Strategy' },
      },
      {
        type: 'rich_text',
        elements: strategyElements,
      },
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Terminology' },
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: termsElements,
          },
        ],
      },
      { type: 'divider' },
      { type: 'divider' },
    ],
  };

  return message;
};

export const fromPolyMarketToSlackMessage = (outcomes) => {
  const items: SlackMessageBlock[] = [];
  for (const outcome of outcomes) {
    const { question, Yes, No } = outcome;

    items.push({
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_quote',
          elements: [{ type: 'text', text: question, style: { bold: true } }],
        },
      ],
    });

    items.push({
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `- *YES* : \`${Yes} %\`` },
        { type: 'mrkdwn', text: `- *No*: ${No} %` },
      ],
    });

    items.push({ type: 'divider' });
  }

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'PolyMarket Digest' },
      },
      ...items,
    ],
  };

  return message;
};

export const from13FtoSlackMessage = (
  name: string,
  blocksArray: SlackMessageBlock[][],
): SlackMessage => {
  const [newlyAdded = [], removed = []] = blocksArray;
  for (const blocks of [newlyAdded, removed]) {
    if (blocks.length === 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: ':ghost:' },
      });
    }
  }

  const blocks: SlackMessageBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${name} 13F-HR` },
    },
    {
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_quote',
          elements: [
            {
              type: 'text',
              text: '신규 (비중 상위 10)',
              style: { bold: true },
            },
          ],
        },
      ],
    },
    ...newlyAdded,
    { type: 'divider' },
    {
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_quote',
          elements: [
            {
              type: 'text',
              text: '청산 (비중 상위 10)',
              style: { bold: true },
            },
          ],
        },
      ],
    },
    ...removed,
  ];

  if (blocks.length >= 50) {
    const splicedBlocks = blocks.splice(0, 49);
    splicedBlocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '슬랙 메시지 블럭 제한으로 이하 생략.' },
    });

    return { blocks: splicedBlocks };
  }

  return {
    blocks,
  };
};
