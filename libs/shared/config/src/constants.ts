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
  // sec sec-filing (13-F 분석)
  ANALYZE_13F = 'ANALYZE_13F',
  // send 13-F analysis result to slack
  NOTIFY_13F = 'NOTIFY_13F',
}

export enum REDIS_NAME {
  ANT_STING = 'ANT_STING',
}
