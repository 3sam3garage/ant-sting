export interface EcosSearchInterface {
  code?: string;
  interval?: 'D' | 'M' | 'Q' | 'Y';
  startDate: string;
  endDate: string;
  subCode?: string;
  skip?: number;
  limit?: number;
}

export interface EcosSearchItem {
  STAT_CODE: string;
  ITEM_NAME1: string;
  ITEM_NAME2: string;
  ITEM_CODE1: string;
  ITEM_CODE2: string;
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
