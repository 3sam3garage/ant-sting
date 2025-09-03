export interface NaverApiImpl {
  marketInfo(): Promise<string>;
  investInfo(): Promise<string>;
  economyInfo(): Promise<string>;
  debentureInfo(): Promise<string>;
  detailPage(path: string): Promise<string>;
}
