import { IsString } from 'class-validator';

export class AddSnippetBody {
  @IsString()
  ticker: string;
}
