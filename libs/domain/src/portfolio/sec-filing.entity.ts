import { Type } from 'class-transformer';

class Filing {
  recent: {
    accessionNumber: string[];
    filingDate: string[];
    form: string[];
    reportDate: string[];
    acceptanceDateTime: string[];
    act: string[];
    fileNumber: string[];
    filmNumber: string[];
    items: string[];
    core_type: string[];
    size: number[];
    isXBRL: number[];
    isInlineXBRL: number[];
    primaryDocument: string[];
    primaryDocDescription: string[];
  };
  files: string[];
}

export class SecFiling {
  name: string;
  issuer: string;
  cik: string;

  @Type(() => Filing)
  filings: Filing;

  filterBut13FHR() {
    const {
      name,
      filings: {
        recent: { accessionNumber = [], form = [], filingDate = [] },
      },
    } = this;

    const items: { url: string; date: string }[] = [];
    for (const [index, value] of Object.entries(form)) {
      if (value === '13F-HR') {
        const name = accessionNumber[index];
        const date = filingDate[index];

        items.push({
          url: `https://www.sec.gov/Archives/edgar/data/${this.cik}/${name.replaceAll('-', '')}/${name}.txt`,
          date,
        });
      }
    }

    return { issuer: name, items };
  }
}
