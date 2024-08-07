import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketInfoReportRepository } from './repository';
import { MarketInfoReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketInfoReport])],
  providers: [MarketInfoReportRepository],
  exports: [MarketInfoReportRepository],
})
export class MarketInfoReportDomainModule {}
