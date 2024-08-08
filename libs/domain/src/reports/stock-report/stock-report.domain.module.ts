import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockReportRepository } from './repository';
import { StockReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockReport])],
  providers: [StockReportRepository],
  exports: [StockReportRepository],
})
export class StockReportDomainModule {}
