import { ObjectId } from 'mongodb';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { TransformObjectId } from '@libs/shared/core';

export class BaseDomainEntity {
  @TransformObjectId()
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
