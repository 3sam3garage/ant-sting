import { BaseDomainEntity } from '../base.domain.entity';

export class EconomicInformation extends BaseDomainEntity {
  items: string[] = [];
  date: string;

  addItem(content: string) {
    this.items.push(content);
  }
}
