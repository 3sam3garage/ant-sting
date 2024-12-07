import { FilterOperators, Index, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EconomicInformationAnalysis } from '../entity';

@Index('date', { unique: true })
@Injectable()
export class EconomicInformationAnalysisRepository extends MongoRepository<EconomicInformationAnalysis> {
  constructor(
    @InjectRepository(EconomicInformationAnalysis)
    private readonly repo: MongoRepository<EconomicInformationAnalysis>,
  ) {
    super(EconomicInformationAnalysis, repo.manager);
  }

  async updateOne(
    entity: EconomicInformationAnalysis,
    data: Partial<EconomicInformationAnalysis>,
  ) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async findOneByDate(date: string): Promise<EconomicInformationAnalysis> {
    return this.repo.findOne({ where: { date } });
  }

  async findByDate(query: {
    from: Date;
    to: Date;
  }): Promise<EconomicInformationAnalysis[]> {
    const { from, to } = query;

    const filterQuery: FilterOperators<EconomicInformationAnalysis> = {
      where: {
        date: { $gte: from, $lte: to },
      },
    };

    return this.repo.find(filterQuery);
  }
}
