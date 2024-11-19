import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';

export class Recommendation {
  @IsNumber()
  @IsOptional()
  @Column()
  price?: number;

  @Column()
  @IsNumber()
  targetPrice: number;

  @Column()
  @IsNumber()
  disparateRatio: number;

  @Column()
  @IsString()
  position: string;
}

@Entity({ name: 'stock-reports' })
export class StockReport extends BaseReportEntity {
  @Column()
  @IsString()
  stockName: string;

  @Column()
  @IsString()
  code: string;

  // @Column(() => Recommendation)
  // @ValidateNested()
  // recommendation?: Recommendation;
  // addRecommendation(opinion: {
  //   price?: string;
  //   targetPrice: string;
  //   position: string;
  // }): void {
  //   const price = onlyNumber(opinion.price);
  //   const targetPrice = onlyNumber(opinion.targetPrice);
  //   let disparateRatio = 0;
  //   if (price && targetPrice) {
  //     disparateRatio = +Math.abs((1 - targetPrice / price) * 100).toFixed(2);
  //   }
  //
  //   this.recommendation = plainToInstance(Recommendation, {
  //     price,
  //     targetPrice,
  //     position: opinion.position,
  //     disparateRatio,
  //   });
  // }

  static create(data: Partial<StockReport>) {
    return plainToInstance(StockReport, data);
  }
}
