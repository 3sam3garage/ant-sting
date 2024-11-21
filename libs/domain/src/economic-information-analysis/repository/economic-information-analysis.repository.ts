import { Index, MongoRepository, ObjectId } from 'typeorm';
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

  async createOne(entity: EconomicInformationAnalysis) {
    return this.repo.save(entity);
  }

  async findOneById(_id: ObjectId): Promise<EconomicInformationAnalysis> {
    return this.repo.findOne({ where: { _id } });
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

  async upsertByDate(
    date: string,
    entity: EconomicInformationAnalysis,
  ): Promise<EconomicInformationAnalysis> {
    entity.date = date;
    return this.repo.save(entity);
  }
}
