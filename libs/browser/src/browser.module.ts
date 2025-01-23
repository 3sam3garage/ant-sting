import { Module } from '@nestjs/common';
import { FirefoxService } from './service';

@Module({
  providers: [FirefoxService],
  exports: [FirefoxService],
})
export class BrowserModule {}
