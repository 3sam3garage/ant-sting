import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  type: 'mongodb';
  url: string;
}

export default registerAs<DatabaseConfig>('DATABASE', () => {
  const { env } = process;

  return {
    type: 'mongodb',
    url: env.ANT_STING_DB_URI || 'mongodb://localhost:27017/ant-sting',
  };
});
