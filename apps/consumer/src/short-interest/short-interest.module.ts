import { Module } from '@nestjs/common';
import { TickerDomainModule } from '@libs/domain';
import { RealtimeShortInterestConsumer } from './service';

@Module({
  imports: [TickerDomainModule],
  providers: [RealtimeShortInterestConsumer],
})
export class ShortInterestModule {}
