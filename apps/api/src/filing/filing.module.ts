import { Module } from '@nestjs/common';
import { FilingDomainModule } from '@libs/domain';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { REDIS_NAME } from '@libs/config';
import { FilingController } from './controllers';
import { FilingService } from './services';

@Module({
  imports: [FilingDomainModule],
  controllers: [FilingController],
  providers: [
    FilingService,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class FilingModule {}
