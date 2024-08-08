import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import commonConfig from './source/common.config';
import databaseConfig from './source/database.config';
import redisConfig from './source/redis.config';
import aiConfig from './source/ai.config';
import {
  CommonConfigService,
  DatabaseConfigService,
  RedisConfigService,
  AiConfigService,
} from './service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [commonConfig, databaseConfig, redisConfig, aiConfig],
      isGlobal: true,
    }),
  ],
  providers: [
    CommonConfigService,
    DatabaseConfigService,
    RedisConfigService,
    AiConfigService,
  ],
  exports: [
    CommonConfigService,
    DatabaseConfigService,
    RedisConfigService,
    AiConfigService,
  ],
})
export class AppConfigModule {}
