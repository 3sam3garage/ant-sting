import { registerAs } from '@nestjs/config';
import { CommonRedisOptions } from 'ioredis';

export default registerAs<CommonRedisOptions>('REDIS', () => {
  const { env } = process;

  return {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
    db: parseInt(env.REDIS_DB) || 0,
  };
});
