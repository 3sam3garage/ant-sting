export interface KcifApiImpl {
  detailPage(fullPath: string): Promise<string>;

  /**
   * 국제금융속보
   */
  newsFlash(): Promise<string>;

  /**
   * 주간보고서
   */
  weekly(): Promise<string>;

  /**
   * 특별일보
   */
  daily(): Promise<string>;
}
