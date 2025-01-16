import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

class ShortInterestItem {
  @Column({ type: Number })
  quantity: number;

  @Column({ type: Number })
  averageDailyVolume: number;

  @Column({ comment: 'yyyy-MM-dd' })
  date: string;
}

@Entity({ name: 'short-interests', comment: '공매도 정보' })
@Index(['ticker'])
export class ShortInterest extends BaseEntity {
  @Column()
  stockName: string;

  @Column()
  ticker: string;

  @Column(() => ShortInterestItem)
  items: ShortInterestItem[] = [];

  static create(data: Partial<ShortInterest>) {
    return plainToInstance(ShortInterest, data);
  }

  addItem(item: ShortInterestItem): boolean {
    const set = new Set(this.items.map((item) => item.date));
    if (set.has(item.date)) {
      return false;
    }

    this.items.push(item);
    return true;
  }
}
