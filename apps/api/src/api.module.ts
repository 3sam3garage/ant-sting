import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CoreModule } from '@libs/shared/core';

@Module({
  imports: [CoreModule, PortfolioModule],
})
export class ApiModule {}
