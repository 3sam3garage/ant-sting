interface Link {
  $: {
    type?: string;
    rel: string;
    href: string;
  };
}

interface Category {
  $: {
    scheme: string;
    label: string;
    term: string;
  };
}

interface Entry {
  title: string; //'4 - Cake Cindy L. (0001788023) (Reporting)';
  link: Link;
  summary: {
    _: '<b>Filed:</b> 2025-01-13 <b>AccNo:</b> 0001127602-25-001137 <b>Size:</b> 7 KB';
    $: {
      type: 'html';
    };
  };
  updated: string; // '2025-01-13T21:57:16-05:00';
  category: Category;
  id: string;
}

export interface FilingRss {
  feed: {
    $: { xmlns: string };
    title: string;
    link: Link[];
    id: string;
    author: {
      name: 'Webmaster';
      email: 'webmaster@sec.gov';
    };
    updated: string; // ex. '2025-01-13T23:38:29-05:00';
    entry: Entry[];
  };
}
