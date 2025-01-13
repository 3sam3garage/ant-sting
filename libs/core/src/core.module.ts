import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppConfigModule,
  DatabaseConfigService,
  REDIS_NAME,
  RedisConfigService,
} from '@libs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    AppConfigModule,
    RedisModule.forRootAsync({
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        return config.getConfig(REDIS_NAME.ANT_STING);
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfigService],
      useFactory: (config: DatabaseConfigService) => config.getConfig(),
    }),
  ],
})
export class CoreModule {}
