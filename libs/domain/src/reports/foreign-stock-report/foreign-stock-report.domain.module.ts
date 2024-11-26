import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForeignStockReportRepository } from './repository';
import { ForeignStockReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForeignStockReport])],
  providers: [ForeignStockReportRepository],
  exports: [ForeignStockReportRepository],
})
export class ForeignStockReportDomainModule {}
