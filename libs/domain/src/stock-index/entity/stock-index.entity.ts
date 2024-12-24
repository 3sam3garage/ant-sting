import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';
import { STOCK_INDEX_COUNTRIES, STOCK_INDEX_TYPE } from '../constants';

@Entity({ name: 'stock-indexes', comment: '2015=100 기준' })
@Index(['country', 'date'], { unique: true })
export class StockIndex extends BaseEntity {
  @Column({ enum: STOCK_INDEX_COUNTRIES })
  country: STOCK_INDEX_COUNTRIES;

  @Column({ enum: STOCK_INDEX_TYPE })
  type: STOCK_INDEX_TYPE;

  @Column({ comment: 'yyyy-MM-dd' })
  date: string;

  @Column()
  indexValue: number;

  static create(data: Partial<StockIndex>) {
    return plainToInstance(StockIndex, data);
  }
}
