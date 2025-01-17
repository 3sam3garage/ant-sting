import { IsString } from 'class-validator';

export class FindShortInterestQuery {
  @IsString()
  ticker: string;
}
