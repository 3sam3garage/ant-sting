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

  async updateOne(
    entity: EconomicInformation,
    data: Partial<EconomicInformation>,
  ) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async findOneByDate(from: Date, to: Date): Promise<EconomicInformation> {
    return this.repo.findOne({
      where: {
        date: { $gte: from, $lte: to },
      },
    });
  }
}
