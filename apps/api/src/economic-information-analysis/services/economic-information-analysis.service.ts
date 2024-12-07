import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EconomicInformationAnalysisRepository } from '@libs/domain';
import { FindByDateQuery } from '../../common';

@Injectable()
export class EconomicInformationAnalysisService {
  constructor(private readonly repo: EconomicInformationAnalysisRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(query: FindByDateQuery) {
    const { from, to } = query;
    return await this.repo.findByDate({ from, to });
  }
}
