import { IsString } from 'class-validator';

export class FindStockMarketNewsQuery {
  @IsString()
  ticker: string;
}
