import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_NAME } from '@libs/config';

@Injectable()
export class InvestmentRedisRepository {
  private readonly PREFIX = 'cusip';
  private readonly ACQUISITION = 'acquisition';
  private readonly DIVESTMENT = 'divestment';

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  async addAcquisitionCount(cusip: string, name: string) {
    const key = `${this.PREFIX}:${cusip}`;

    const prev = await this.redis.hget(key, this.ACQUISITION);

    await Promise.all([
      this.redis.hset(key, 'name', name),
      this.redis.hset(key, this.ACQUISITION, +prev + 1),
    ]);
  }

  async addDivestmentCount(cusip: string, name: string) {
    const key = `${this.PREFIX}:${cusip}`;

    const prev = await this.redis.hget(key, this.DIVESTMENT);

    await Promise.all([
      this.redis.hset(key, 'name', name),
      this.redis.hset(key, this.DIVESTMENT, +prev + 1),
    ]);
  }

  async getInvestments(cusip: string) {
    const investments = await this.redis.hgetall(`${this.PREFIX}:${cusip}`);

    return {
      acquisition: +investments[this.ACQUISITION] || 0,
      divestment: +investments[this.DIVESTMENT] || 0,
    };
  }
}
