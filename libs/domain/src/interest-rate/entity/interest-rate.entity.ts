import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';
import { INTEREST_COUNTRIES, INTEREST_TYPE } from '../constants';

@Entity({ name: 'interest-rates' })
@Index(['type', 'date'], { unique: true })
export class InterestRate extends BaseEntity {
  @Column({ enum: INTEREST_COUNTRIES })
  country: INTEREST_COUNTRIES;

  @Column({ enum: INTEREST_TYPE })
  type: INTEREST_TYPE;

  @Column({ comment: 'yyyy-MM' })
  date: string;

  @Column()
  interestRate: number;

  static create(data: Partial<InterestRate>) {
    return plainToInstance(InterestRate, data);
  }
}
