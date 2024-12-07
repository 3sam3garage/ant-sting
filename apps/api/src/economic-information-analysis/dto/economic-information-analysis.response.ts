import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class EconomicInformationAnalysisResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty({ example: '2024-08-08' })
  date: string;
}
