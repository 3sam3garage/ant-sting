export class FormerName {
  name: string;
  from: string;
  to: string;
}

class Address {
  street1: string;
  street2: string | null;
  city: string;
  stateOrCountry: string;
  zipCode: string;
  stateOrCountryDescription: string;
}

export class SecFiling {
  cik: string;
  entityType: 'operating';
  sic: string;
  sicDescription: string;
  ownerOrg: string;
  insiderTransactionForOwnerExists: number;
  insiderTransactionForIssuerExists: number;
  name: string;
  tickers: string[];
  exchanges: string[];
  ein: string;
  description: string;
  website: string;
  investorWebsite: string;
  category: string;
  fiscalYearEnd: string;
  stateOfIncorporation: string;
  stateOfIncorporationDescription: string;
  addresses: {
    mailing: Address;
    business: Address;
  };
  phone: string;
  flags: string;
  formerNames: FormerName[];
  filings: {
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
  };
}
