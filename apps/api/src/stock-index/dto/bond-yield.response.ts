import { ApiProperty } from '@nestjs/swagger';

export class BondYieldResponse {
  @ApiProperty({ example: '2024-08-08' })
  date: string;
}

export class BondYieldChartResponse {
  @ApiProperty({ example: '2024-08-08' })
  date: string;

  // todo enum 을 키값으로 어떻게 넣는지 찾아보자.
}
