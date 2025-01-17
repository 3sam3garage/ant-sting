import { Injectable } from '@nestjs/common';
import { ShortInterestRepository } from '@libs/domain';
import { FindShortInterestQuery, ShortInterestResponse } from '../dto';

@Injectable()
export class ShortInterestService {
  constructor(
    private readonly shortInterestRepository: ShortInterestRepository,
  ) {}

  async findOneByTicker({ ticker }: FindShortInterestQuery) {
    const entity = await this.shortInterestRepository.findOne({
      where: { ticker },
    });

    return ShortInterestResponse.fromEntity(entity);
  }
}
