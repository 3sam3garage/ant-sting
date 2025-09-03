export interface InvestmentRedisRepositoryImpl {
  addAcquisitionCount(cusip: string, name: string): Promise<void>;
  addDivestmentCount(cusip: string, name: string): Promise<void>;
  getInvestments(
    cusip: string,
    name: string,
  ): Promise<{
    acquisition: number;
    divestment: number;
  }>;
}
