import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MacroEnvironment } from '../entity';

@Injectable()
export class MacroEnvironmentRepository extends MongoRepository<MacroEnvironment> {
  constructor(
    @InjectRepository(MacroEnvironment)
    private readonly repo: MongoRepository<MacroEnvironment>,
  ) {
    super(MacroEnvironment, repo.manager);
  }

  async createOne(data: MacroEnvironment) {
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async updateOne(entity: MacroEnvironment, data: Partial<MacroEnvironment>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
