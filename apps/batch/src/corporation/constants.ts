import { AxiosRequestConfig } from 'axios';

export const FILE_DOWNLOAD_HEADER: Partial<AxiosRequestConfig> = {
  responseType: 'arraybuffer',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
};

export enum FINANCIAL_STATEMENT_TYPE {
  // 자본변동표
  CHANGES_IN_EQUITY = 'changesInEquity',
  // 현금흐름표
  CASH_FLOW = 'cashFlow',
  // 손익계산서
  PROFIT_AND_LOSS = 'profitAndLoss',
  // 재무상태표
  BALANCE_SHEET = 'balanceSheet',
}

export const FINANCIAL_STATEMENT_COLUMNS = [
  '재무제표종류',
  '종목코드',
  '회사명',
  '시장구분',
  '업종',
  '업종명',
  '결산월',
  '결산기준일',
  '보고서종류',
  '통화',
  '항목코드',
  '항목명',
  '항목값',
];
