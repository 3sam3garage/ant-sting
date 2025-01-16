export interface FinraShortInterest {
  // 정산일 yyyy-MM-dd
  settlementDate: string;
  accountingYearMonthNumber: string;
  // ticker 와 동일
  symbolCode: string;
  // 회사명
  issueName: string;
  issuerServicesGroupExchangeCode: string;
  // 상장 시장
  marketClassCode: string;
  // 당기 공매도 수량
  currentShortPositionQuantity: string;
  // 전기 공매도 수량
  previousShortPositionQuantity: string;
  stockSplitFlag: string;
  // average daily volume
  averageDailyVolumeQuantity: string;
  daysToCoverQuantity: string;
  revisionFlag: string;
  // 전 분기대비 증감
  changePreviousNumber: string;
  // 전 분기대비 증감 비율
  changePercent: string;
}

/**
 * {
 *   "accountingYearMonthNumber": "20241231",
 *   "symbolCode": "AACG",
 *   "issueName": "ATA Creativity Global American",
 *   "issuerServicesGroupExchangeCode": "R",
 *   "marketClassCode": "NNM",
 *   "currentShortPositionQuantity": "154350",
 *   "previousShortPositionQuantity": "154160",
 *   "stockSplitFlag": "",
 *   "averageDailyVolumeQuantity": "24958",
 *   "daysToCoverQuantity": "6.18",
 *   "revisionFlag": "",
 *   "changePercent": "0.12",
 *   "changePreviousNumber": "190",
 *   "settlementDate": "2024-12-31"
 * }
 */
