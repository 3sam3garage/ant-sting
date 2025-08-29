import { ObjectId } from 'mongodb';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class BaseEntity {
  _id: ObjectId;

  createdAt: Date;

  updatedAt: Date;

  static create<T extends BaseEntity>(
    this: ClassConstructor<T>,
    data: Partial<T>,
  ): T {
    return plainToInstance(this, data);
  }
}
