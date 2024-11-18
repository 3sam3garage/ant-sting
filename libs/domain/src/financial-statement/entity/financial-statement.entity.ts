import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseEntity } from '../../base.entity';
import { FINANCIAL_STATEMENT_TYPE } from '../constants';

export class FinancialStatementField {
  @Column()
  @IsString()
  통화: string;

  @Column()
  @IsString()
  항목코드: string;

  @Column()
  @IsString()
  항목명: string;

  @Column()
  @IsString()
  항목값: string;
}

@Entity({ name: 'financial-statements', comment: '재무제표' })
export class FinancialStatement extends BaseEntity {
  @Column()
  @IsString()
  재무제표종류: string;

  @Column()
  @IsString()
  종목코드: string;

  @Column()
  @IsString()
  회사명: string;

  @Column()
  @IsString()
  시장구분: string;

  @Column()
  @IsString()
  업종: string;

  @Column()
  @IsString()
  업종명: string;

  @Column()
  @IsString()
  결산월: string;

  @Column()
  @IsString()
  결산기준일: string;

  @Column()
  @IsString()
  보고서종류: string;

  @Column()
  @IsString()
  유형: FINANCIAL_STATEMENT_TYPE;

  @Column(() => FinancialStatementField)
  항목들: FinancialStatementField[] = [];

  static create(data: Partial<FinancialStatement>) {
    return plainToInstance(FinancialStatement, data);
  }
}
