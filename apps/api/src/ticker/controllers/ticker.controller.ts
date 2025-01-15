import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TickerService } from '../services';
import { AddSnippetBody } from '../dto';

@ApiTags('tickers')
@Controller('tickers')
export class TickerController {
  constructor(private readonly service: TickerService) {}

  @Get()
  async find() {
    return this.service.find();
  }

  @Get('/snippets')
  async findSnippets(): Promise<string[]> {
    return this.service.findSnippets();
  }

  //http://192.168.1.107:3002/api/tickers/snippets
  @Post('/snippets')
  async addSnippet(@Body() body: AddSnippetBody) {
    return this.service.addSnippet(body.ticker);
  }

  @Delete('snippets')
  async deleteSnippets(@Query('ticker') ticker: string): Promise<void> {
    return this.service.deleteSnippets(ticker);
  }
}
