import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { REPORT_SUMMARY_TYPE } from '../constants';

class AIScore {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

@Entity({ name: 'report-summaries' })
export class ReportSummary extends BaseEntity {
  @Column()
  @IsString()
  date: string;

  @Column()
  @IsEnum(REPORT_SUMMARY_TYPE)
  type: REPORT_SUMMARY_TYPE;

  @Column(() => AIScore, { array: true })
  @ValidateNested({ each: true })
  aiScores?: AIScore[];

  static create(data: Partial<ReportSummary>) {
    return plainToInstance(ReportSummary, data);
  }

  addAiScore(aiScore: AIScore): void {
    if (!this.aiScores) {
      this.aiScores = [];
    }

    this.aiScores.push(aiScore);
  }
}
