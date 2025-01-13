import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TickerService } from '../services';

@ApiTags('tickers')
@Controller('tickers')
export class TickerController {
  constructor(private readonly service: TickerService) {}

  @Get('/snippets')
  async findSnippets(): Promise<string[]> {
    return this.service.findSnippets();
  }
}
