import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@config/config';
import { DatabaseConfigService } from '@config/config/service';

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
