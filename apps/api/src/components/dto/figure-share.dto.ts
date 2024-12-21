import { ApiProperty } from '@nestjs/swagger';
import { MARKET_TYPE } from '@libs/domain';

export class FigureShareResponse {
  @ApiProperty()
  share: Record<MARKET_TYPE, number>;
}
