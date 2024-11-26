import { Column } from 'typeorm';
import { IsString } from 'class-validator';
import { BaseEntity } from '../base.entity';

/**
 * naver report entity 타입
 */
export class NaverReportEntity extends BaseEntity {
  @Column({ comment: '네이버 nid' })
  @IsString()
  uuid: string;

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

  // @deprecated 실제론 number 타입임
  @Column()
  @IsString()
  views: string;

  @IsString()
  @Column()
  summary?: string;
}
