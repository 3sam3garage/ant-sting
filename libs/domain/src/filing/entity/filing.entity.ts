import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'filings', comment: '티커' })
@Index(['url'])
export class Filing extends BaseEntity {
  @Column()
  ticker: string;

  @Column()
  cik: number;

  @Column()
  date: string;

  @Column()
  url: string;

  static create(data: Partial<Filing>) {
    return plainToInstance(Filing, data);
  }
}
