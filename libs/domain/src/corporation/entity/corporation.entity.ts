import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity({ name: 'corporations' })
export class Corporation extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  stockCode?: string;

  @Column()
  lastModified: string;

  static create(data: Partial<Corporation>) {
    return plainToInstance(Corporation, data);
  }

  static createFromSource(item: {
    corp_code: string;
    corp_name: string;
    stock_code: string;
    modify_date: string;
  }) {
    const dateReplacer = (text: string) =>
      text.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

    return Corporation.create({
      code: item.corp_code,
      name: item.corp_name,
      stockCode: item.stock_code,
      lastModified: dateReplacer(item.modify_date),
    });
  }
}
