import { Module } from '@nestjs/common';
import { StockMarketNewsDomainModule } from '@libs/domain';
import { StockMarketNewsService } from './services';
import { StockMarketNewsController } from './controllers';

@Module({
  imports: [StockMarketNewsDomainModule],
  controllers: [StockMarketNewsController],
  providers: [StockMarketNewsService],
})
export class StockMarketNewsModule {}
