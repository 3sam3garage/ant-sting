import { BaseEntity } from '../base.entity';

export class EconomicInformation extends BaseEntity {
  items: string[] = [];
  date: string;

  addItem(content: string) {
    this.items.push(content);
  }
}
