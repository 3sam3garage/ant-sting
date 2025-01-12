import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'tickers', comment: '티커' })
@Index(['ticker'], { unique: true })
@Index(['cik'], { unique: true })
export class Ticker extends BaseEntity {
  @Column()
  stockName: string;

  @Column()
  ticker: string;

  @Column()
  cik: number;

  static create(data: Partial<Ticker>) {
    return plainToInstance(Ticker, data);
  }

  get tenDigitCIK(): string {
    const prefixCount = 10 - `${this.cik}`.length;
    const prefix = new Array(prefixCount).fill('0').join('');
    return `CIK${prefix}${this.cik}`;
  }
}
