import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { MARKET_POSITION, MARKET_TYPE } from '../../../constants';
import { BaseReportEntity } from '../../base.report.entity';

@Entity({ name: 'stock-reports' })
export class StockReport extends BaseReportEntity {
  @Column({ comment: '시장 종류' })
  @IsEnum(MARKET_TYPE)
  market: MARKET_TYPE;

  @Column({ comment: '종목명' })
  @IsString()
  stockName: string;

  @Column({ comment: '종목코드' })
  @IsString()
  code: string;

  // @todo 아래 두 필드는 pdf 파싱으로 완전히 넘어가면 없어질 필드
  @Column({ comment: '목표가' })
  @IsString()
  targetPrice?: number;

  @Column({ comment: '구매의견' })
  @IsEnum(MARKET_POSITION)
  position?: MARKET_POSITION;

  static create(data: Partial<StockReport>) {
    return plainToInstance(StockReport, data);
  }
}
