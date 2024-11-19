import { Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'stock-analysis' })
export class StockAnalysis extends BaseEntity {
  static create(data: Partial<StockAnalysis>) {
    return plainToInstance(StockAnalysis, data);
  }
}
