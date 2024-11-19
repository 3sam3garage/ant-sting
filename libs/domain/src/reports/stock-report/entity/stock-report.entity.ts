import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { MARKET_POSITION } from '@libs/core';
import { BaseReportEntity } from '../../base.report.entity';

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
