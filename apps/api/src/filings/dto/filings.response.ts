import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Filing } from '@libs/domain';
import { plainToInstance } from 'class-transformer';

class FilingAnalysis {
  @ApiProperty()
  score: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  summaries: string[] = [];
}

export class FilingsResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  ticker: string;

  @ApiProperty()
  formType: string;

  @ApiProperty()
  cik: number;

  @ApiProperty({ example: '2024-08-08' })
  date: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  analysis?: FilingAnalysis;

  static fromEntity(entity: Filing) {
    return plainToInstance(FilingsResponse, entity);
  }
}
