import { countBy } from 'lodash';
import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import {
  FigureFilingShareQuery,
  FilingResponse,
  FindFilingsQuery,
} from '../dto';

@Injectable()
export class FilingService {
  constructor(private readonly repo: FilingRepository) {}

  async find(query: FindFilingsQuery) {
    const filings = await this.repo.findFilingsWithAnalysis(query);
    return filings.map((filing) => FilingResponse.fromEntity(filing));
  }

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return FilingResponse.fromEntity(entity);
  }

  async figureShare(query: FigureFilingShareQuery) {
    const { key, ticker } = query;

    const filings = await this.repo.find({ where: { ticker } });
    const share = countBy(filings, key);

    delete share.undefined;

    return { share };
  }
}
