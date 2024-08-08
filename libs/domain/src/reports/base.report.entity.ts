import { BaseEntity } from '../base.entity';
import { Column } from 'typeorm';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class AIScore {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

export class BaseReportEntity extends BaseEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  detailUrl: string;

  @Column()
  @IsString()
  stockFirm: string;

  @Column()
  @IsString()
  file: string;

  @Column()
  @IsString()
  date: string;

  @Column()
  @IsString()
  // @deprecated 실제론 number 타입임
  views: string;

  @IsString()
  @Column()
  summary?: string;

  @Column(() => AIScore, { array: true })
  @ValidateNested({ each: true })
  aiScores?: AIScore[];

  addAiScore(aiScore: AIScore): void {
    if (!this.aiScores) {
      this.aiScores = [];
    }

    this.aiScores.push(aiScore);
  }
}
