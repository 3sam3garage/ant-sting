export enum NODE_ENV {
  /** 개발 환경 */
  DEVELOPMENT = 'development',

  /** 테스트 환경 */
  TEST = 'test',

  /** 운영 환경 */
  PRODUCTION = 'production',
}

export enum DB_NAME {
  ANT_STING = 'ant-sting',
}

export enum QUEUE_NAME {
  /**
   * 매크로 환경
   * - 시황
   * - 투자정보
   * - 경제분석
   * - 채권분석
   */
  MACRO_ENVIRONMENT = 'MACRO_ENVIRONMENT',
  STOCK_REPORT_SCORE = 'STOCK_REPORT_SCORE',
}
