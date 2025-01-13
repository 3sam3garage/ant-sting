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
      // 'https://www.sec.gov/Archives/edgar/data/1816431/000114036125000295/ny20041128x2_8k.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1838359/000196794025000002/xsl144X01/primary_doc.xml',
      'https://www.sec.gov/Archives/edgar/data/1837607/000183760725000005/aeon-20250224xpre14a.htm',
    );

    const prompt = ANALYZE_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      document,
    );

    const response = await claudeService.invoke(prompt);
    const {
      summaries,
      analysis: { sentiment, reason },
    } = response;

    const entity = FilingAnalysis.create({ summaries, sentiment, reason });
    console.log(entity);
  });
});
