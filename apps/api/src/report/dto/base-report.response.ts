import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class AIScore {
  @ApiProperty()
  score: number;

  @ApiProperty()
  reason: string;
}

export class ScoreInfo {
  @ApiProperty()
  avgScore: number;

  @ApiProperty()
  items: AIScore[];
}

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

  @ApiProperty()
  date: string;

  @ApiProperty()
  views: string;

  @ApiProperty({ required: false })
  summary?: string;

  @ApiProperty({ required: false })
  scoreInfo?: ScoreInfo;
}
