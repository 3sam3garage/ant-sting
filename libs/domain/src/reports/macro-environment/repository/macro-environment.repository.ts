import { Index, MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MacroEnvironment } from '../entity';

@Index('date', { unique: true })
@Injectable()
export class MacroEnvironmentRepository extends MongoRepository<MacroEnvironment> {
  constructor(
    @InjectRepository(MacroEnvironment)
    private readonly repo: MongoRepository<MacroEnvironment>,
  ) {
    super(MacroEnvironment, repo.manager);
  }

  async createOne(entity: MacroEnvironment) {
    return this.repo.save(entity);
  }

  async findOneById(_id: ObjectId): Promise<MacroEnvironment> {
    return this.repo.findOne({ where: { _id } });
  }

  async updateOne(entity: MacroEnvironment, data: Partial<MacroEnvironment>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async findOneByDate(date: string): Promise<MacroEnvironment> {
    return this.repo.findOne({ where: { date } });
  }

  async upsertByDate(
    date: string,
    entity: MacroEnvironment,
  ): Promise<MacroEnvironment> {
    entity.date = date;
    return this.repo.save(entity);
  }
}
