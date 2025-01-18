import { Module } from '@nestjs/common';
import { StockIndexDomainModule } from '@libs/domain';
import { StockIndexController } from './controllers';
import { StockIndexService } from './services';

@Module({
  imports: [StockIndexDomainModule],
  controllers: [StockIndexController],
  providers: [StockIndexService],
})
export class StockIndexModule {}
