export interface BaseReport {
  nid: string;
  title: string;
  detailUrl: string;
  stockFirm: string;
  file: string;
  date: string;
  views: string; // todo 실제론 number 타입인데 파싱 번거로워서
}

export interface StockReport extends BaseReport {
  stockName: string;
}

export interface InvestReport extends BaseReport {}
