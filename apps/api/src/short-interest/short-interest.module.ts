import { Module } from '@nestjs/common';
import { ShortInterestDomainModule } from '@libs/domain';
import { ShortInterestController } from './controllers';
import { ShortInterestService } from './services';

@Module({
  imports: [ShortInterestDomainModule],
  controllers: [ShortInterestController],
  providers: [ShortInterestService],
})
export class ShortInterestModule {}
