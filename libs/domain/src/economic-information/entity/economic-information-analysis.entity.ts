import { IsDate, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

class Strategy {
  @Column()
  @IsString()
  action: string;

  @Column()
  @IsString()
  reason: string;
}

class Question {
  @Column()
  @IsString()
  question: string;

  @Column()
  @IsString()
  answer: string;
}

@Entity({
  name: 'economic-information-analysis',
  comment: '경제 정보 분석',
})
export class EconomicInformationAnalysis extends BaseEntity {
  @Column()
  @IsString({ each: true })
  summaries: string[];

  @Column()
  @IsString({ each: true })
  insights: string[];

  @Column(() => Strategy, { array: true })
  strategies: Strategy[];

  @Column(() => Question, { array: true })
  questions: Question[];

  @Column()
  @IsString({ each: true })
  terminologies: string[];

  @Column({ type: 'datetime' })
  @IsDate()
  date: Date;

  static create(data: Partial<EconomicInformationAnalysis>) {
    return plainToInstance(EconomicInformationAnalysis, data);
  }
}
