import { BaseReportResponse } from './base-report.response';
import { ApiProperty } from '@nestjs/swagger';

export class StockReportResponse extends BaseReportResponse {
  @ApiProperty()
  stockName: string;

  @ApiProperty()
  code: string;
}
