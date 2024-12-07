import { Index, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EconomicInformation } from '../entity';

@Index('date', { unique: true })
@Injectable()
export class EconomicInformationRepository extends MongoRepository<EconomicInformation> {
  constructor(
    @InjectRepository(EconomicInformation)
    private readonly repo: MongoRepository<EconomicInformation>,
  ) {
    super(EconomicInformation, repo.manager);
  }

  async createOne(entity: EconomicInformation) {
    return this.repo.save(entity);
  }

  async findOneByDate(date: string): Promise<EconomicInformation> {
    return this.repo.findOne({ where: { date } });
  }
}
