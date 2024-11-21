import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class BaseReportResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  detailUrl: string;

  @ApiProperty()
  stockFirm: string;

  @ApiProperty()
  file: string;

  @ApiProperty({ example: '2024-08-08' })
  date: string;

  @ApiProperty()
  views: string;

  @ApiProperty({ required: false })
  summary?: string;
}
