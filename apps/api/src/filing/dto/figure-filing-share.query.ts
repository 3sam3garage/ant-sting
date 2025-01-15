import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FigureFilingShareQuery {
  @ApiProperty({ type: String })
  @IsString()
  key: string;

  @ApiProperty({ type: String })
  @IsString()
  ticker: string;
}
