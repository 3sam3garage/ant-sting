import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import redisConfig from '../source/redis.config';

@Injectable()
export class RedisConfigService {
  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  getConfig() {
    return this.config;
  }
}
