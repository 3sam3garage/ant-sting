import { BaseEntity } from '../base.entity';
import { Column } from 'typeorm';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { figureAverageScore } from '@libs/domain/reports/utils';

export class AIScore {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

export class ScoreInfo {
  @Column()
  @IsNumber()
  avgScore: number;

  @Column(() => AIScore, { array: true })
  @ValidateNested({ each: true })
  items: AIScore[] = [];
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
  @IsDate()
  date: Date;

  @Column()
  @IsString()
  // @deprecated 실제론 number 타입임
  views: string;

  @IsString()
  @Column()
  summary?: string;

  @Column(() => ScoreInfo)
  @ValidateNested()
  scoreInfo?: ScoreInfo;

  addScore(aiScore: AIScore): void {
    if (!this.scoreInfo) {
      this.scoreInfo = new ScoreInfo();
    }

    this.scoreInfo.items.push(aiScore);
    this.scoreInfo.avgScore = figureAverageScore(this.scoreInfo.items);
  }
}
