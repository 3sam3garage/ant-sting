import { Inject, Injectable } from '@nestjs/common';
import databaseConfig, { DatabaseConfig } from '../source/database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(
    @Inject(databaseConfig.KEY) private readonly config: DatabaseConfig,
  ) {}

  getConfig(): TypeOrmModuleOptions {
    return {
      ...this.config,
      entities: ['./dist/**/*.entity.js', './libs/**/*.entity.js'],
    };
  }
}
