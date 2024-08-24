import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Corporation } from '../entity';

@Injectable()
export class CorporationRepository extends MongoRepository<Corporation> {
  constructor(
    @InjectRepository(Corporation)
    private readonly repo: MongoRepository<Corporation>,
  ) {
    super(Corporation, repo.manager);
  }
}
