export enum MARKET_POSITION {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

export enum MARKET_TYPE {
  KR = 'KR',
  US = 'US',
  JP = 'JP',
  HK = 'HK',

  // 중국
  CH = 'CH',
  // 독일
  GR = 'GR',
  // 프랑스
  FP = 'FP',
  // 덴마크
  DK = 'DK',
  DC = 'DC',
  // 대만
  TT = 'TT',
}

export const MARKET_TYPE_SET = new Set(Object.values(MARKET_TYPE));

export enum CURRENCY_TYPE {
  KRW = 'KRW',
  JPY = 'JPY',
  USD = 'USD',
  CNY = 'CNY',
  HKD = 'HKD',
  TWD = 'TWD',
  EUR = 'EUR',
  GBP = 'GBP',
}
