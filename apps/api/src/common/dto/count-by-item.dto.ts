import { ApiProperty } from '@nestjs/swagger';

export class CountByItemResponse {
  @ApiProperty()
  items: Record<string, number>;
}
