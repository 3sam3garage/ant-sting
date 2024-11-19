import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { MARKET_POSITION } from '../constants';

@Entity({ name: 'stock-reports' })
export class StockReport extends BaseReportEntity {
  @Column()
  @IsString()
  stockName: string;

  @Column()
  @IsString()
  code: string;

  @Column()
  @IsString()
  targetPrice: number;

  @Column()
  @IsEnum(MARKET_POSITION)
  position: MARKET_POSITION;

  static create(data: Partial<StockReport>) {
    return plainToInstance(StockReport, data);
  }
}
