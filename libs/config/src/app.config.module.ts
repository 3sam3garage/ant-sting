import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import commonConfig from './source/common.config';
import databaseConfig from './source/database.config';
import redisConfig from './source/redis.config';
import {
  CommonConfigService,
  DatabaseConfigService,
  RedisConfigService,
} from './service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [commonConfig, databaseConfig, redisConfig],
      isGlobal: true,
    }),
  ],
  providers: [CommonConfigService, DatabaseConfigService, RedisConfigService],
  exports: [CommonConfigService, DatabaseConfigService, RedisConfigService],
})
export class AppConfigModule {}
