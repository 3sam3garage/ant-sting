import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGO_REPOSITORY_TOKEN } from '@libs/application';
import { PortfolioRepository } from './repository';
import { Portfolio } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  providers: [
    {
      provide: MONGO_REPOSITORY_TOKEN.PORTFOLIO,
      useClass: PortfolioRepository,
    },
  ],
  exports: [MONGO_REPOSITORY_TOKEN.PORTFOLIO],
})
export class PortfolioMongoModule {}
