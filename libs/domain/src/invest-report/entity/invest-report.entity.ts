import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
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

  @IsString()
  @Column()
  summary?: string;

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

  // assign(entity: InvestReport, data: Partial<InvestReport>) {
  //   Object.assign(entity, data);
  //   return entity;
  // }

  addAiScore(aiScore: AIScore): void {
    if (!this.aiScores) {
      this.aiScores = [];
    }

    this.aiScores.push(aiScore);
  }

  @BeforeInsert()
  onCreate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }
}
