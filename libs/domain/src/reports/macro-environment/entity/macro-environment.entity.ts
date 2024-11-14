import { IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '../../../base.entity';

class Item {
  @Column({ default: [] })
  @IsString({ each: true })
  summaries: string[] = [];
}

@Entity({ name: 'macro-environments' })
export class MacroEnvironment extends BaseEntity {
  @Column(() => Item)
  @ValidateNested()
  marketInfo = new Item();

  @Column(() => Item)
  @ValidateNested()
  invest = new Item();

  @Column(() => Item)
  @ValidateNested()
  economy = new Item();

  @Column(() => Item)
  @ValidateNested()
  debenture = new Item();

  @Column()
  @IsString()
  date: string;

  static create(data: Partial<MacroEnvironment>) {
    return plainToInstance(MacroEnvironment, data);
  }
}
