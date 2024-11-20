// export enum SLACK_MESSAGE_TYPE {
//   HEADER = 'header',
//   DIVIDER = 'divider',
//   RICH_TEXT = 'rich_text',
//   RICH_TEXT_LIST = 'rich_text_list',
//   RICH_TEXT_SECTION = 'rich_text_section',
// }

interface Text {
  type: 'plain_text' | 'text' | 'mrkdwn';
  text: string;
}

export interface SlackMessageBlock {
  type:
    | 'text'
    | 'mrkdwn'
    | 'header'
    | 'divider'
    | 'rich_text'
    | 'rich_text_quote'
    | 'rich_text_preformatted'
    | 'plain_text'
    | 'rich_text_list'
    | 'rich_text_section';

  style?: 'bullet';
  text?: Text | string;
  elements?: SlackMessageBlock[] | Text[];
}

export interface SlackMessage {
  blocks: SlackMessageBlock[];
}
