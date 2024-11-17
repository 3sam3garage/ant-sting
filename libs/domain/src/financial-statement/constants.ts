export enum FINANCIAL_STATEMENT_TYPE {
  // 자본변동표 - 사실상 같은 값이 넘어오는 데이터가 많아서 의미있는 데이터는 아닌 것 같다.
  CHANGES_IN_EQUITY = '자본변동표',
  // 현금흐름표
  CASH_FLOW = '현금흐름표',
  // 손익계산서
  PROFIT_AND_LOSS = '손익계산서',
  // 재무상태표
  BALANCE_SHEET = '재무상태표',
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
