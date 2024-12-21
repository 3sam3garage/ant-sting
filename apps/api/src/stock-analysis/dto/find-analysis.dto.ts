import { FindByDateQuery } from '../../components';
import { IsEnum, IsOptional } from 'class-validator';
import { MARKET_POSITION, MARKET_TYPE } from '@libs/domain';
import { ApiProperty } from '@nestjs/swagger';

export class FindAnalysisQuery extends FindByDateQuery {
  @ApiProperty()
  @IsOptional()
  @IsEnum(MARKET_TYPE)
  market?: MARKET_TYPE;

  @ApiProperty()
  @IsOptional()
  @IsEnum(MARKET_POSITION)
  aiSuggestion?: MARKET_POSITION;

  @ApiProperty()
  @IsOptional()
  @IsEnum(MARKET_POSITION)
  reportSuggestion?: MARKET_POSITION;
}
