import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { Filing } from '@libs/domain';

class FilingAnalysis {
  @IsNumber()
  score: number;

  @IsString()
  reason: string;

  @IsString({ each: true })
  summaries: string[] = [];
}

export class FilingResponse {
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
