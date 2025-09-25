import { ObjectId } from 'mongodb';
import { DeepPartial, EntityManager, Index, SaveOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  EconomicInformation as DomainEntity,
  EconomicInformationRepositoryImpl,
} from '@libs/domain';
import { EconomicInformation as Persistence } from '../entity';
import { BaseRepository } from '../../base.repository';

@Index('date', { unique: true })
@Injectable()
export class EconomicInformationRepository
  extends BaseRepository<Persistence, DomainEntity>
  implements EconomicInformationRepositoryImpl
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

  async updateOne(
    entity: DomainEntity,
    data: Partial<DomainEntity>,
  ): Promise<DomainEntity> {
    Object.assign(this.toPersistence(entity), data);
    const persistence = await this.em.save(Persistence, entity);
    return this.toDomain(persistence);
  }

  async findOneByDate(date: string): Promise<DomainEntity> {
    const persistence = await this.em.findOne(Persistence, {
      where: { date },
    });
    return this.toDomain(persistence);
  }

  async findOneById(_id: ObjectId): Promise<DomainEntity> {
    const persistence = await this.em.findOneById(Persistence, _id);
    return this.toDomain(persistence);
  }

  async save<T extends DeepPartial<DomainEntity>>(
    entity: T,
    options: SaveOptions = { reload: true },
  ): Promise<DomainEntity> {
    const persistence = await this.em.save(Persistence, entity, options);
    return this.toDomain(persistence);
  }

  protected toDomain(persistence: Persistence): DomainEntity {
    const domain = plainToInstance(DomainEntity, persistence);
    console.log(persistence._id.toString());
    console.log(domain._id.toString());

    return domain;
  }

  protected toPersistence(domain: DomainEntity): Persistence {
    return plainToInstance(Persistence, domain);
  }
}
