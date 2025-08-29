interface Text {
  type: 'plain_text' | 'text' | 'mrkdwn';
  text: string;
  emoji?: boolean;
}

export interface SlackMessageBlock {
  type:
    | 'section'
    | 'context'
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

  style?: 'bullet' | Record<string, string | boolean>;
  text?: Text | string;
  elements?: SlackMessageBlock[] | Text[];
  fields?: SlackMessageBlock[] | Text[];
}

export interface SlackMessage {
  blocks: SlackMessageBlock[];
}
