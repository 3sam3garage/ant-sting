import { Module } from '@nestjs/common';
import { ExchangeRateDomainModule } from '@libs/domain';
import { ExchangeRateController } from './controllers';
import { ExchangeRateService } from './services';

@Module({
  imports: [ExchangeRateDomainModule],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
})
export class ExchangeRateModule {}
