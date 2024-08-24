import { BaseReportResponse } from './base-report.response';
import { ApiProperty } from '@nestjs/swagger';

export class Recommendation {
  @ApiProperty()
  price?: number;

  @ApiProperty()
  targetPrice: number;

  @ApiProperty()
  disparateRatio: number;

  @ApiProperty()
  position: string;
}

export class StockReportResponse extends BaseReportResponse {
  @ApiProperty({ required: false })
  recommendation?: Recommendation;

  @ApiProperty()
  stockName: string;

  @ApiProperty()
  code: string;
}
