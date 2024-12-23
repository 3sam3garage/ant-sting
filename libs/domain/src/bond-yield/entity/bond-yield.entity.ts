import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';
import { BOND_COUNTRIES, BOND_TYPE } from '../constants';

@Entity({ name: 'bond-yields' })
@Index(['country', 'date'], { unique: true })
export class BondYield extends BaseEntity {
  @Column({ enum: BOND_COUNTRIES })
  country: BOND_COUNTRIES;

  @Column({ enum: BOND_TYPE })
  type: BOND_TYPE;

  @Column({ comment: 'yyyy-MM-dd' })
  date: string;

  @Column()
  interestRate: number;

  static create(data: Partial<BondYield>) {
    return plainToInstance(BondYield, data);
  }
}
