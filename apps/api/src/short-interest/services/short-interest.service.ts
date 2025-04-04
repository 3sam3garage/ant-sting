import { ObjectId } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShortInterestRepository } from '@libs/domain';
import { FindShortInterestQuery, ShortInterestResponse } from '../dto';

@Injectable()
export class ShortInterestService {
  constructor(private readonly repo: ShortInterestRepository) {}

  async findByDate({ ticker }: FindShortInterestQuery) {
    const entity = await this.repo.findOne({ where: { ticker } });
    if (!entity) {
      throw new NotFoundException('ShortInterest entity not found');
    }
    const { items } = ShortInterestResponse.fromEntity(entity);
    return items;
  }

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return ShortInterestResponse.fromEntity(entity);
  }
}
