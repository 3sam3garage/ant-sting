import {
  EconomicInformationAnalysis,
  Filing,
  StockAnalysis,
} from '@libs/domain';
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

export const fromForeignStockAnalysisToSlackMessage = (
  stockAnalysis: StockAnalysis[],
): SlackMessage => {
  const stockBlocks = stockAnalysis.map((item) => {
    const { stockName, aiAnalysis, reportAnalysis, currency, market } = item;

    return [
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_quote',
            elements: [
              {
                type: 'text',
                text: `🔥 ${stockName} (${market})`,
                style: { bold: true },
              },
              { type: 'text', text: '\n' },
              {
                type: 'text',
                text: `AI Target Price: ${aiAnalysis.targetPrice} ${currency}`,
                style: { bold: true },
              },
              { type: 'text', text: '\n' },
              {
                type: 'text',
                text: `Analyst Target Price: ${reportAnalysis.targetPrice} ${currency}`,
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
    ];
  }) as SlackMessageBlock[][];

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 오늘의 해외 종목', emoji: true },
      },
      ...stockBlocks.flatMap((item) => item),
    ],
  };

  return message;
};

export const fromSecFilingToSlackMessage = (filing: Filing): SlackMessage => {
  const {
    ticker,
    url,
    analysis: { score, reason },
  } = filing;

  const scoreToStars = (score: number = 0) => {
    let stars = '';
    for (let i = 0; i < score; i++) {
      stars += ':star:';
    }

    return stars;
  };

  return <SlackMessage>{
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':fire: *호재 공시*',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${ticker}*  ${scoreToStars(+score)}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: reason,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '공시 상세',
            emoji: true,
          },
          value: 'click_me_123',
          url,
          action_id: 'button-action',
        },
      },
    ],
  };
};
