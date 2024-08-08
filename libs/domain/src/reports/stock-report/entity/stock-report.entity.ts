import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'stock-reports' })
export class StockReport extends BaseReportEntity {
  @Column()
  @IsString()
  stockName: string;

  @Column()
  @IsString()
  code: string;

  static create(data: Partial<StockReport>) {
    return plainToInstance(StockReport, data);
  }
}
