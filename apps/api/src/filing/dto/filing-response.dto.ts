import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Filing } from '@libs/domain';
import { ObjectId } from 'mongodb';

class FilingAnalysis {
  @IsNumber()
  score: number;

  @IsString()
  reason: string;

  @IsString({ each: true })
  summaries: string[] = [];
}

export class FilingResponse {
  @Transform((value) => value.obj._id.toString())
  _id: ObjectId;

  @IsString()
  ticker: string;

  @IsString()
  formType: string;

  @IsNumber()
  cik: number;

  @IsString()
  date: string;

  @IsString()
  url: string;

  @ValidateNested({ each: true })
  @Type(() => FilingAnalysis)
  analysis?: FilingAnalysis;

  static fromEntity(entity: Filing) {
    return plainToInstance(FilingResponse, entity);
  }
}
