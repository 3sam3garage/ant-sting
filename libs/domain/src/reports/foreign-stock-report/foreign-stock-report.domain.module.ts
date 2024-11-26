import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForeignStockReportRepository } from './repository';
import { StockReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockReport])],
  providers: [ForeignStockReportRepository],
  exports: [ForeignStockReportRepository],
})
export class ForeignStockReportDomainModule {}
