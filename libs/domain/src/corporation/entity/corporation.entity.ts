import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'corporations' })
export class Corporation extends BaseEntity {
  @Column()
  corporationCode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  stockCode?: string;

  @Column()
  lastModified: Date;

  static create(data: Partial<Corporation>) {
    return plainToInstance(Corporation, data);
  }
}
