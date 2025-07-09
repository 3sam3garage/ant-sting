import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'sec-filings', comment: 'sec 제출 보고서' })
@Index(['url'])
@Index(['formType'])
export class SecFiling extends BaseEntity {
  @Column()
  formType: string;

  @Column()
  cik: number;

  @Column()
  date: string;

  @Column()
  url: string;

  static create(data: Partial<SecFiling>) {
    return plainToInstance(SecFiling, data);
  }
}
