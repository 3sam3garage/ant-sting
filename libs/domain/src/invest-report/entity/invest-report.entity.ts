import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

class AIScore {
  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
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

  @Column(() => AIScore, { array: true })
  @ValidateNested({ each: true })
  aiScores?: AIScore[];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  static create(data: Partial<InvestReport>) {
    return plainToInstance(InvestReport, data);
  }

  @BeforeInsert()
  createTimestamp() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
