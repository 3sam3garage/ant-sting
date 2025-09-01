import { ObjectId } from 'mongodb';
import { DeepPartial, Index, MongoRepository, SaveOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  EconomicInformation as EiDomain,
  EconomicInformationRepositoryImpl,
} from '@libs/domain';
import { EconomicInformation as EiPersistence } from '../entity';

@Index('date', { unique: true })
@Injectable()
export class EconomicInformationRepository
  extends MongoRepository<EiPersistence>
  implements EconomicInformationRepositoryImpl
{
  constructor(
    @InjectRepository(EiPersistence)
    private readonly repo: MongoRepository<EiPersistence>,
  ) {
    super(EiPersistence, repo.manager);
  }

  async createOne(entity: EiDomain): Promise<EiDomain> {
    const persistence = await this.repo.save(entity);
    return this.toDomain(persistence);
  }

  async updateOne(
    entity: EiDomain,
    data: Partial<EiDomain>,
  ): Promise<EiDomain> {
    Object.assign(this.toPersistence(entity), data);
    const persistence = await this.repo.save(entity);
    return this.toDomain(persistence);
  }

  async findOneByDate(date: string): Promise<EiDomain> {
    const persistence = await this.repo.findOne({ where: { date } });
    return this.toDomain(persistence);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async findOneById(_id: ObjectId): Promise<EiDomain> {
    const persistence = await this.repo.findOneById(_id);
    return this.toDomain(persistence);
  }

  async save<T extends DeepPartial<EiDomain>>(
    entities: T,
    options: SaveOptions = { reload: true },
  ): Promise<T> {
    return super.save(entities, options);
  }

  private toDomain(persistence: EiPersistence): EiDomain {
    return plainToInstance(EiDomain, persistence);
  }

  private toPersistence(domain: EiDomain): EiPersistence {
    return plainToInstance(EiPersistence, domain);
  }
}
