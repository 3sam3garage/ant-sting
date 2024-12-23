import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CURRENCY_TYPE } from '../../constants';
import { BaseEntity } from '../../base.entity';

@Entity({
  name: 'currency-exchange-rates',
  comment: '환율 (달러 기준)',
})
@Index(['baseCurrency', 'targetCurrency', 'date'], { unique: true })
export class ExchangeRate extends BaseEntity {
  @Column({ enum: CURRENCY_TYPE })
  baseCurrency: CURRENCY_TYPE;

  @Column({ enum: CURRENCY_TYPE })
  targetCurrency: CURRENCY_TYPE;

  @Column({ comment: 'yyyy-MM-dd' })
  date: string;

  @Column()
  exchangeRate: number;

  static create(data: Partial<ExchangeRate>) {
    return plainToInstance(ExchangeRate, data);
  }
}
