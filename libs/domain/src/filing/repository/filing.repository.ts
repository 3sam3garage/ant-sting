import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filing } from '../entity';

@Injectable()
export class FilingRepository extends MongoRepository<Filing> {
  constructor(
    @InjectRepository(Filing)
    private readonly repo: MongoRepository<Filing>,
  ) {
    super(Filing, repo.manager);
  }
}
