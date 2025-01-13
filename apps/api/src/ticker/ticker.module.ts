import { Module } from '@nestjs/common';
import { FilingDomainModule } from '@libs/domain';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { REDIS_NAME } from '@libs/config';
import { TickerController } from './controllers';
import { TickerService } from './services';

@Module({
  imports: [FilingDomainModule],
  controllers: [TickerController],
  providers: [
    TickerService,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class TickerModule {}
