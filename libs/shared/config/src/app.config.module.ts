import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import commonConfig from './source/common.config';
import databaseConfig from './source/database.config';
import redisConfig from './source/redis.config';
import externalApiConfig from './source/external-api-config';
import {
  CommonConfigService,
  DatabaseConfigService,
  RedisConfigService,
  ExternalApiConfigService,
} from './service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [commonConfig, databaseConfig, redisConfig, externalApiConfig],
      isGlobal: true,
    }),
  ],
  providers: [
    CommonConfigService,
    DatabaseConfigService,
    RedisConfigService,
    ExternalApiConfigService,
  ],
  exports: [
    CommonConfigService,
    DatabaseConfigService,
    RedisConfigService,
    ExternalApiConfigService,
  ],
})
export class AppConfigModule {}
