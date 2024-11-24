import { EconomicInformationAnalysis, StockAnalysis } from '@libs/domain';
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

export const fromStockAnalysisToSlackMessage = (
  stockAnalysis: StockAnalysis[],
): SlackMessage => {
  const stockBlocks = stockAnalysis.map((item) => {
    const { stockName, aiAnalysis, reportAnalysis } = item;

    return [
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_quote',
            elements: [
              {
                type: 'text',
                text: `🔥 ${stockName}`,
                style: { bold: true },
              },
              { type: 'text', text: '\n' },
              {
                type: 'text',
                text: `Target Price: (AI: ${aiAnalysis.targetPrice} / Analyst: ${reportAnalysis.targetPrice})`,
                style: { bold: true },
              },
            ],
          },
          {
            type: 'rich_text_preformatted',
            elements: [{ type: 'text', text: aiAnalysis.reason }],
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '바로가기',
          },
          value: stockName,
          url: `https://tossinvest.com/stocks/A${item.stockCode}`,
          action_id: item.uuid,
        },
      },
    ];
  }) as SlackMessageBlock[][];

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 오늘의 종목', emoji: true },
      },
      ...stockBlocks.flatMap((item) => item),
    ],
  };

  return message;
};
