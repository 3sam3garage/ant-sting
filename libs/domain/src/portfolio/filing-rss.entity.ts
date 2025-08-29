import { Type } from 'class-transformer';

class LinkDetail {
  type?: string;
  rel: string;
  href: string;
}

class Link {
  @Type(() => LinkDetail)
  $: LinkDetail;
}

class Entry {
  @Type(() => Link)
  link: Link;

  get href() {
    return this.link.$.href;
  }
}

class Feed {
  @Type(() => Entry)
  entry: Entry[];
}

export class FilingRss {
  @Type(() => Feed)
  feed: Feed;

  get feedsEntries() {
    return this.feed.entry;
  }
}
