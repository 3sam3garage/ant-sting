import { Module } from '@nestjs/common';
import { FilingDomainModule } from '@libs/domain';
import { FilingsController } from './controllers';
import { FilingsService } from './services';

@Module({
  imports: [FilingDomainModule],
  controllers: [FilingsController],
  providers: [FilingsService],
})
export class FilingsModule {}
