import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  db: number;
}

export default registerAs<RedisConfig>('REDIS', () => {
  const { env } = process;

  return {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
    db: parseInt(env.REDIS_DB) || 0,
  };
});
