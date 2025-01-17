import { Module } from '@nestjs/common';
import { ShortInterestDomainModule } from '@libs/domain';
import { ShortInterestController } from './controllers';
import { ShortInterestService } from './services';
import { REDIS_NAME } from '@libs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [ShortInterestDomainModule],
  controllers: [ShortInterestController],
  providers: [
    ShortInterestService,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class ShortInterestModule {}
