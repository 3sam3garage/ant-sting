import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class SecApiMapper {
  private toPersistence() {}

  private toDomain<T>(type: ClassConstructor<T>, record: unknown): T {
    return plainToInstance(type, record);
  }
}
