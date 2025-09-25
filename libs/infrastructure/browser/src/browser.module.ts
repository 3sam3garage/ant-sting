import { Module } from '@nestjs/common';
import { BROWSERS_TOKEN } from '@libs/application';
import { ChromiumService } from './service';

@Module({
  providers: [{ provide: BROWSERS_TOKEN.CHROMIUM, useClass: ChromiumService }],
  exports: [BROWSERS_TOKEN.CHROMIUM],
})
export class BrowserModule {}
