import { EconomicInformationAnalysis } from '../economic-information-analysis.domain';
import { ObjectId } from 'mongodb';

export interface EconomicInformationAnalysisRepositoryImpl {
  createOne(
    entity: EconomicInformationAnalysis,
  ): Promise<EconomicInformationAnalysis>;

  updateOne(
    domain: EconomicInformationAnalysis,
    data: Partial<EconomicInformationAnalysis>,
  ): Promise<EconomicInformationAnalysis>;

  findOneByDate(date: string): Promise<EconomicInformationAnalysis>;

  findOneById(_id: ObjectId): Promise<EconomicInformationAnalysis>;

  save(
    domain: EconomicInformationAnalysis,
  ): Promise<EconomicInformationAnalysis>;
}
