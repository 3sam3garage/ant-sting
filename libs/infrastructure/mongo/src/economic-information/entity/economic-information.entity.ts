import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({
  name: 'economic-information',
  comment: '경제 정보 raw data',
})
export class EconomicInformation extends BaseEntity {
  @Column({ default: [] })
  @IsString({ each: true })
  items: string[] = [];

  @Column()
  @IsString()
  date: string;

  static create(data: Partial<EconomicInformation>) {
    return plainToInstance(EconomicInformation, data);
  }
}
