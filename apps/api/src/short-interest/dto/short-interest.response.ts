import { IsString, ValidateNested } from 'class-validator';
import { Column } from 'typeorm';
import { plainToInstance, Type } from 'class-transformer';

class ShortInterestItem {
  @Column({ type: Number })
  quantity: number;

  @Column({ type: Number })
  averageDailyVolume: number;

  @Column({ comment: 'yyyy-MM-dd' })
  date: string;
}

export class ShortInterestResponse {
  @IsString()
  stockName: string;

  @IsString()
  ticker: string;

  @Type(() => ShortInterestItem)
  @ValidateNested({ each: true })
  items: ShortInterestItem[] = [];

  static fromEntity(data: Partial<ShortInterestResponse>) {
    const entity = plainToInstance(ShortInterestResponse, data);

    return {
      ...entity,
      items: entity?.items?.reverse() || [],
    };
  }
}
