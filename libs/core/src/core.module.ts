import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, DatabaseConfigService } from '@libs/config';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfigService],
      useFactory: (config: DatabaseConfigService) => config.getConfig(),
    }),
  ],
})
export class CoreModule {}
