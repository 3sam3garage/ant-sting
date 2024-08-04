import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppConfigModule,
  DatabaseConfigService,
  RedisConfigService,
} from '@libs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfigService],
      useFactory: (config: DatabaseConfigService) => config.getConfig(),
    }),
    BullModule.forRootAsync({
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => ({
        connection: config.getConfig(),
      }),
    }),
  ],
})
export class CoreModule {}
