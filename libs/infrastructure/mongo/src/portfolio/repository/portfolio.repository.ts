import { plainToInstance } from 'class-transformer';
import { DeepPartial, EntityManager, SaveOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  Portfolio as DomainEntity,
  PortfolioRepositoryImpl,
} from '@libs/domain';
import { Portfolio as Persistence } from '../entity';
import { ObjectId } from 'mongodb';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class PortfolioRepository
  extends BaseRepository<Persistence, DomainEntity>
  implements PortfolioRepositoryImpl
{
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {
    super();
  }

  async findByPeriod(start: string, end: string): Promise<DomainEntity[]> {
    return this.em.find(Persistence, {
      where: {
        // eslint-disable-next-line
        // @ts-ignore
        date: { $gte: start, $lte: end },
      },
    });
  }

  async findOneByUrl(url: string) {
    const persistence = await this.em.findOne(Persistence, {
      where: { url },
    });
    if (!persistence) {
      return null;
    }

    return this.toDomain(persistence);
  }

  async save<T extends DeepPartial<DomainEntity>>(
    entity: T,
    options: SaveOptions = { reload: true },
  ): Promise<DomainEntity> {
    const persistence = await this.em.save(Persistence, entity, options);
    return this.toDomain(persistence);
  }

  async findOneById(_id: ObjectId): Promise<DomainEntity> {
    const persistence = await this.em.findOneById(Persistence, _id);
    return this.toDomain(persistence);
  }

  async findOnePreviousByIdAndIssuer(
    id: ObjectId,
    issuer: string,
  ): Promise<DomainEntity | null> {
    const persistence = await this.em.findOne(Persistence, {
      where: {
        issuer,
        // eslint-disable-next-line
        // @ts-ignore
        _id: { $lt: new ObjectId(id) },
      },
    });

    if (persistence) {
      return this.toDomain(persistence);
    }

    return null;
  }

  protected toDomain(persistence: Persistence): DomainEntity {
    const domain = DomainEntity.create(persistence);
    domain._id = persistence._id;
    return domain;
  }

  protected toPersistence(domain: DomainEntity): Persistence {
    const persistence = plainToInstance(Persistence, domain);
    persistence._id = domain._id;
    return persistence;
  }
}
