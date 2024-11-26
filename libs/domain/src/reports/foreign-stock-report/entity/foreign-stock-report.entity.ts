import { Column, Entity, Index } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { MARKET_TYPE } from '../../../constants';
import { BaseEntity } from '../../../base.entity';

@Index('file')
@Entity({ name: 'foreign-stock-reports' })
export class ForeignStockReport extends BaseEntity {
  @Column()
  @IsString()
  uuid: string;

  @Column({ comment: '시장 종류' })
  @IsEnum(MARKET_TYPE)
  market: MARKET_TYPE;

  @Column({ comment: '종목명' })
  @IsString()
  stockName: string;

  @Column({ comment: '종목코드' })
  @IsString()
  code?: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  stockFirm: string;

  @Column()
  @IsString()
  file: string;

  @Column()
  @IsString()
  date: string;

  static create(data: Partial<ForeignStockReport>) {
    return plainToInstance(ForeignStockReport, data);
  }
}
