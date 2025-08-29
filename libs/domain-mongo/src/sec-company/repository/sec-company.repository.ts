import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecCompanyEntity } from '../entity';

@Injectable()
/**
 * @deprecated
 */
export class SecCompanyRepository extends MongoRepository<SecCompanyEntity> {
  constructor(
    @InjectRepository(SecCompanyEntity)
    private readonly repo: MongoRepository<SecCompanyEntity>,
  ) {
    super(SecCompanyEntity, repo.manager);
  }
}
