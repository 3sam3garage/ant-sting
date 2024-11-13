import { IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../../base.entity';

class Item {
  @Column()
  @IsString()
  summary: string = '';
}

@Entity({ name: 'macro-environments' })
export class MacroEnvironment extends BaseEntity {
  @Column(() => Item)
  @ValidateNested()
  marketInfo: Item;

  @Column(() => Item)
  @ValidateNested()
  invest: Item;

  @Column(() => Item)
  @ValidateNested()
  economy: Item;

  @Column(() => Item)
  @ValidateNested()
  debenture: Item;

  @Column()
  @IsString()
  date: string;

  static create(data: Partial<MacroEnvironment>) {
    return plainToInstance(MacroEnvironment, data);
  }
}
