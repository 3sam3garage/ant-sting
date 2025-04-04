import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import { FindFilingsQuery, FilingsResponse } from '../dto';

@Injectable()
export class FilingsService {
  constructor(private readonly repo: FilingRepository) {}

  async findByDate(query: FindFilingsQuery) {
    const entities = await this.repo.findByDate(query);

    return entities.map((entity) => FilingsResponse.fromEntity(entity));
  }

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return FilingsResponse.fromEntity(entity);
  }
}
