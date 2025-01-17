import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '../source/database.config';
import redisConfig from '../source/redis.config';

@Injectable()
export class DatabaseConfigService {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>,
    @Inject(redisConfig.KEY)
    private readonly redisConf: ConfigType<typeof redisConfig>,
  ) {}

  getConfig(): TypeOrmModuleOptions {
    return {
      ...this.config,
      entities: ['./dist/**/*.entity.js', './libs/**/*.entity.js'],
      cache: {
        type: 'ioredis',
        options: {
          socket: { ...this.redisConf },
        },
      },
    };
  }
}
