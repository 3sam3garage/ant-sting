export const SEC_FILING_URL_SET = 'sec-filing-url-set';

export const FILINGS_TO_ANALYZE = [
  // 연간 보고서
  '10-K',
  //분기 보고서
  '10-Q',
  //수시 보고서
  '8-K',
  '8-K/A',
  // 외국 기업의 수시 보고서
  '6-K',
  // 내부자 거래 보고
  '4',
  //대량 매도 의향서
  '144',

  // 5% 이상 지분 보고
  'SCHEDULE 13D/A',
  'SCHEDULE 13G',

  // 합병/인수 관련 통신문
  '425',

  // ??
  'PRE 14A',
  'PRE 14C',
  'NT 10-Q',
];
