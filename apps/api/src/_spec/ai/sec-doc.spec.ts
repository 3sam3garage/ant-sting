import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@libs/config';
import { AiModule, ANALYZE_SEC_DOCUMENT_PROMPT, ClaudeService } from '@libs/ai';
import { ExternalApiModule, SecApiService } from '@libs/external-api';
import { FilingAnalysis } from '@libs/domain';

describe('SEC Document', () => {
  let moduleRef: TestingModule;
  let claudeService: ClaudeService;
  let secApiService: SecApiService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AiModule, ExternalApiModule],
      providers: [ClaudeService, SecApiService],
    }).compile();

    claudeService = moduleRef.get(ClaudeService);
    secApiService = moduleRef.get(SecApiService);
  });

  it('analyze filing document', async () => {
    const document = await secApiService.fetchFilingDocument(
      'https://www.sec.gov/Archives/edgar/data/1506983/000149315224050469/form424b5.htm',
    );

    const prompt = ANALYZE_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      document,
    );

    const response = await claudeService.invoke(prompt);
    const {
      summaries,
      analysis: { score, reason },
    } = response;

    const entity = FilingAnalysis.create({ summaries, score, reason });
    console.log(entity);
  });
});
