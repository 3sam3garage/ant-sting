import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'bullmq';

export default registerAs<ConnectionOptions>('REDIS', () => {
  const { env } = process;

  return {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
    db: parseInt(env.REDIS_DB) || 0,
  };
});
