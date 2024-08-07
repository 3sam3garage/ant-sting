import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

class AIScore {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

@Entity({ name: 'market-info-reports' })
export class MarketInfoReport extends BaseEntity {
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

  static create(data: Partial<MarketInfoReport>) {
    return plainToInstance(MarketInfoReport, data);
  }

  addAiScore(aiScore: AIScore): void {
    if (!this.aiScores) {
      this.aiScores = [];
    }

    this.aiScores.push(aiScore);
  }
}
