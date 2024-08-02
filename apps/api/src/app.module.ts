import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
