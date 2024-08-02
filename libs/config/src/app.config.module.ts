import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import commonConfig from './source/common.config';
import databaseConfig from './source/database.config';
import { CommonConfigService, DatabaseConfigService } from './service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [commonConfig, databaseConfig],
      isGlobal: true,
    }),
  ],
  providers: [CommonConfigService, DatabaseConfigService],
  exports: [CommonConfigService, DatabaseConfigService],
})
export class AppConfigModule {}
