import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

export class PortfolioItem {
  @Column()
  name: string;

  @Column()
  cusip: string;

  @Column()
  date: string;

  @Column({ comment: '보유 주식수' })
  shareAmount: number;

  @Column({ comment: 'USD' })
  value: number;

  @Column()
  portion: number;
}

@Entity({ name: 'portfolios' })
export class Portfolio extends BaseEntity {
  @Column()
  issuer: string;

  @Column()
  url: string;

  @Column()
  date: string;

  @Column()
  totalValue: number;

  @Column(() => PortfolioItem, { array: true })
  items: PortfolioItem[];

  static create(data: Partial<Portfolio>) {
    return plainToInstance(Portfolio, data);
  }
}
