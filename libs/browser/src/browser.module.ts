import { Module } from '@nestjs/common';
import { ChromiumService } from './service';

@Module({
  providers: [ChromiumService],
  exports: [ChromiumService],
})
export class BrowserModule {}
