import { plainToInstance } from 'class-transformer';
import { DeepPartial, MongoRepository, SaveOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Portfolio as PortfolioDomain,
  PortfolioRepositoryImpl,
} from '@libs/domain';
import { Portfolio as PortfolioPersistence } from '../entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PortfolioRepository
  extends MongoRepository<PortfolioPersistence>
  implements PortfolioRepositoryImpl
{
  constructor(
    @InjectRepository(PortfolioPersistence)
    private readonly repo: MongoRepository<PortfolioPersistence>,
  ) {
    super(PortfolioPersistence, repo.manager);
  }

  async findOneByUrl(url: string) {
    const persistence = await this.repo.findOne({ where: { url } });
    if (!persistence) {
      return null;
    }

    return this.toDomain(persistence);
  }

  async save<T extends DeepPartial<PortfolioDomain>>(
    entities: T,
    options: SaveOptions = { reload: true },
  ): Promise<T> {
    return super.save(entities, options);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async findOneById(id: ObjectId): Promise<PortfolioDomain> {
    return this.repo.findOne({ where: { _id: new ObjectId(id) } });
  }

  async findOnePreviousByIdAndIssuer(
    id: ObjectId,
    issuer: string,
  ): Promise<PortfolioDomain> {
    return this.repo.findOne({
      where: { issuer, _id: { $lt: new ObjectId(id) } },
    });
  }

  private toDomain(persistence: PortfolioPersistence): PortfolioDomain {
    return plainToInstance(PortfolioDomain, persistence);
  }

  private toPersistence(domain: PortfolioDomain): PortfolioPersistence {
    return plainToInstance(PortfolioPersistence, domain);
  }
}
