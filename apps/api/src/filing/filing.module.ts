import { Module } from '@nestjs/common';
import { FilingDomainModule } from '@libs/domain';
import { FilingController } from './controllers';
import { FilingService } from './services';

@Module({
  imports: [FilingDomainModule],
  controllers: [FilingController],
  providers: [FilingService],
})
export class FilingModule {}
