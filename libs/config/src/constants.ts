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
  // 네이버 증권 (시황, 투자, 경제, 채권)
  ECONOMIC_INFORMATION = 'ECONOMIC_INFORMATION',
  // 증권사 리포트 PDF 분석
  ANALYZE_STOCK = 'ANALYZE_STOCK',
  // SEC 보고서(filing) 조회
  FETCH_FILING = 'FETCH_FILING',
  // SEC 보고서(filing) 분석
  ANALYZE_FILING = 'ANALYZE_FILING',

  // 실시간 공매도현황 크롤링 ( fintel )
  SCRAPE_REALTIME_SHORT = 'SCRAPE_REALTIME_SHORT',
}

export enum REDIS_NAME {
  ANT_STING = 'ANT_STING',
}
