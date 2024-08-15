import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';

export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @BeforeInsert()
  onCreate() {
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }
}
