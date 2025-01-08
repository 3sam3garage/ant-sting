import { Module } from '@nestjs/common';
import { BondYieldDomainModule } from '@libs/domain';
import { BondYieldController } from './controllers';
import { BondYieldService } from './services';

@Module({
  imports: [BondYieldDomainModule],
  controllers: [BondYieldController],
  providers: [BondYieldService],
})
export class BondYieldModule {}
