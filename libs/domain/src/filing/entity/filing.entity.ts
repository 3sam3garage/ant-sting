import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

export class FilingAnalysis {
  @Column()
  score: number;

  @Column()
  reason: string;

  @Column()
  summaries: string[] = [];

  static create(data: Partial<FilingAnalysis>) {
    return plainToInstance(FilingAnalysis, data);
  }
}

@Entity({ name: 'filings', comment: 'sec 제출 보고서' })
@Index(['url'])
@Index(['formType'])
export class Filing extends BaseEntity {
  @Column()
  ticker: string;

  @Column()
  formType: string;

  @Column()
  cik: number;

  @Column()
  date: string;

  @Column()
  url: string;

  @Column(() => FilingAnalysis)
  analysis?: FilingAnalysis;

  static create(data: Partial<Filing>) {
    return plainToInstance(Filing, data);
  }
}
