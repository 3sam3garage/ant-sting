import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AiModule,
  ANALYZE_SEC_DOCUMENT_PROMPT,
  ClaudeService,
  OllamaService,
} from '@libs/ai';
import { ExternalApiModule, SecApiService } from '@libs/external-api';
import { AppConfigModule } from '@libs/config';
import { parse as parseHTML } from 'node-html-parser';

describe('ollama', () => {
  let moduleRef: TestingModule;
  let ollamaService: OllamaService;
  let secApiService: SecApiService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AiModule, ExternalApiModule],
      providers: [OllamaService, SecApiService],
    }).compile();

    ollamaService = moduleRef.get(ClaudeService);
    secApiService = moduleRef.get(SecApiService);
  });

  it('analyze filing', async () => {
    const document = await secApiService.fetchFilingDocument(
      'https://www.sec.gov/Archives/edgar/data/1114446/000183988225015512/ubs_424b2-07543.htm',
    );
    const html = parseHTML(document);
    const body = html.querySelector('body');
    const content = body?.innerHTML ? body?.innerHTML : html?.innerHTML;
    const prompt = ANALYZE_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      content,
    );

    const response = await ollamaService.invoke(prompt);
    console.log(response);
  });
});
