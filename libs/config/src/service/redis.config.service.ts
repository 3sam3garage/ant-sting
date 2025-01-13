import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommonRedisOptions } from 'ioredis';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import redisConfig from '../source/redis.config';
import { REDIS_NAME } from '../constants';

@Injectable()
export class RedisConfigService {
  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  getCommonConfig(): CommonRedisOptions {
    return this.config;
  }

  getConfig(namespace: REDIS_NAME): RedisModuleOptions {
    return {
      config: {
        namespace,
        ...this.config,
      },
    };
  }
}
