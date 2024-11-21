import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({
  name: 'economic-information-analysis',
  comment: '경제 정보 분석',
})
export class EconomicInformationAnalysis extends BaseEntity {
  @Column({ default: [] })
  @IsString({ each: true })
  items: string[] = [];

  @Column()
  @IsString()
  date: string;

  static create(data: Partial<EconomicInformationAnalysis>) {
    return plainToInstance(EconomicInformationAnalysis, data);
  }
}
