import { EconomicInformation } from '../economic-information.entity';

export interface EconomicInformationRepositoryImpl {
  createOne(entity: EconomicInformation): Promise<EconomicInformation>;

  updateOne(
    domain: EconomicInformation,
    data: Partial<EconomicInformation>,
  ): Promise<EconomicInformation>;

  findOneByDate(date: string): Promise<EconomicInformation>;

  findOneById(_id: unknown): Promise<EconomicInformation>;

  save(domain: EconomicInformation): Promise<EconomicInformation>;
}
