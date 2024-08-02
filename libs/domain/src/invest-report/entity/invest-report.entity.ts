import { IsNumber, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

class Summary {
  @Column()
  @IsString()
  summary: string;

  @Column()
  @IsNumber()
  score: string;
}

@Entity({ name: 'invest-reports' })
export class InvestReport {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @Column()
  @IsString()
  // @deprecated 실제론 number 타입임
  views: string;

  @Column(() => Summary)
  summary?: Summary;

  static create(data: Partial<InvestReport>) {
    return plainToInstance(InvestReport, data);
  }
}
