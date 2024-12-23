export interface EcosSearchInterface {
  code: string;
  interval: 'D' | 'M' | 'Q' | 'Y';
  startDate: string;
  endDate: string;
  subCode?: string;
  skip?: number;
  limit?: number;
}

export interface EcosSearchItem {
  STAT_CODE: string;
  ITEM_CODE: string;
  UNIT_NAME: string;
  TIME: string; //yyyMMdd
  DATA_VALUE: string;
}

export interface EcosSearchResponse {
  StatisticSearch: {
    list_total_count: number;
    row: EcosSearchItem[];
  };
}
