import { Module } from '@nestjs/common';
import { InterestRateDomainModule } from '@libs/domain';
import { InterestRateController } from './controllers';
import { InterestRateService } from './services';

@Module({
  imports: [InterestRateDomainModule],
  controllers: [InterestRateController],
  providers: [InterestRateService],
})
export class InterestRateModule {}
