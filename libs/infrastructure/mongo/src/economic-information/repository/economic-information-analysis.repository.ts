import { DeepPartial, EntityManager, Index, SaveOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  EconomicInformationAnalysis as DomainEntity,
  EconomicInformationAnalysisRepositoryImpl,
} from '@libs/domain';
import { ObjectId } from 'mongodb';
import { plainToInstance } from 'class-transformer';
import { EconomicInformationAnalysis as Persistence } from '../entity';
import { BaseRepository } from '@libs/infrastructure/mongo/base.repository';

@Index('date', { unique: true })
@Injectable()
export class EconomicInformationAnalysisRepository
  extends BaseRepository<Persistence, DomainEntity>
  implements EconomicInformationAnalysisRepositoryImpl
{
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {
    super();
  }

  async createOne(entity: DomainEntity): Promise<DomainEntity> {
    const persistence = await this.em.save(Persistence, entity);
    return this.toDomain(persistence);
  }

  async findOneById(_id: ObjectId): Promise<DomainEntity> {
    const persistence = await this.em.findOneById(Persistence, _id);
    return this.toDomain(persistence);
  }

  async save<T extends DeepPartial<DomainEntity>>(
    entity: T,
    options: SaveOptions = { reload: true },
  ): Promise<Persistence> {
    return this.em.save(Persistence, entity, options);
  }

  async updateOne(
    entity: DomainEntity,
    data: Partial<DomainEntity>,
  ): Promise<DomainEntity> {
    Object.assign(this.toPersistence(entity), data);
    const persistence = await this.em.save(Persistence, entity);
    return this.toDomain(persistence);
  }

  async findOneByDate(date: string): Promise<DomainEntity> {
    const persistence = await this.em.findOneById(Persistence, date);
    return this.toDomain(persistence);
  }

  protected toDomain(persistence: Persistence): DomainEntity {
    return plainToInstance(DomainEntity, persistence);
  }

  protected toPersistence(domain: DomainEntity): Persistence {
    return plainToInstance(Persistence, domain);
  }
}
