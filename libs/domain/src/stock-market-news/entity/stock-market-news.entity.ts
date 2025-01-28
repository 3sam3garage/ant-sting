import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { BaseEntity } from '../../base.entity';

export class Analysis {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

@Entity({ name: 'stock-market-news' })
export class StockMarketNews extends BaseEntity {
  // @Column({ comment: '뉴스 키값' })
  // @IsString()
  // uuid: string;

  @Column()
  @IsString()
  url: string;

  @Column()
  @IsString()
  title?: string;

  @Column({ comment: 'tickers' })
  @IsString({ each: true })
  tickers: string[] = [];

  @Column()
  @IsString({ each: true })
  summaries: string[] = [];

  @Column()
  @IsString()
  date?: string;

  @Column(() => Analysis)
  analysis?: Analysis;

  static create(data: Partial<StockMarketNews>) {
    return plainToInstance(StockMarketNews, data);
  }
}
