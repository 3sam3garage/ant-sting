import { ObjectId } from 'mongodb';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class BaseDomainEntity {
  _id: ObjectId;

  createdAt: Date;

  updatedAt: Date;

  static create<T extends BaseDomainEntity>(
    this: ClassConstructor<T>,
    data: Partial<T>,
  ): T {
    return plainToInstance(this, data);
  }
}
