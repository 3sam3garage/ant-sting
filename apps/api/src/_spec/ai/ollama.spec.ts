import { Test, TestingModule } from '@nestjs/testing';
import {
  AiModule,
  ANALYZE_SEC_DOCUMENT_PROMPT,
  GEMMA_ANALYZE_PDF_STOCK_REPORT,
  GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED,
  OllamaService,
} from '@libs/ai';
import { ExternalApiModule, SecApiService } from '@libs/external-api';
import { AppConfigModule } from '@libs/config';
import { parse as parseHTML } from 'node-html-parser';
import axios from 'axios';
import { fromBuffer } from 'pdf2pic';
import pdf from 'pdf-parse';

describe('ollama', () => {
  let moduleRef: TestingModule;
  let ollamaService: OllamaService;
  let secApiService: SecApiService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AiModule, ExternalApiModule],
      providers: [OllamaService, SecApiService],
    }).compile();

    ollamaService = moduleRef.get(OllamaService);
    secApiService = moduleRef.get(SecApiService);
  });

  it('analyze filing', async () => {
    const document = await secApiService.fetchFilingDocument(
      // 'https://www.sec.gov/Archives/edgar/data/38777/000003877725000053/0000038777-25-000053-index.htm',
      'https://www.sec.gov/Archives/edgar/data/354190/000112760225009555/0001127602-25-009555-index.htm',
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

  it('analyze pdf', async () => {
    const summary = {
      title: '도쿄일렉트론 (8035 JP): 가이던스 상향에도 부진한 주가 흐름 지속',
      href: 'https://www.hanaw.com/main/research/research/download.cmd?bbsSeq=1280907&attachFileSeq=1&bbsId=&dbType=&bbsCd=4003',
    };

    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
    const imageResponse = await fromBuffer(item.data).bulk([1, 2, 3], {
      responseType: 'base64',
    });

    const response = await ollamaService.invokeMultimodal({
      prompt: GEMMA_ANALYZE_PDF_STOCK_REPORT,
      images: imageResponse.map((image) => image.base64),
    });
    console.log(response);
  });

  it('analyze pdf in text', async () => {
    const summary = {
      // href: 'https://stock.pstatic.net/stock-research/company/2/20250320_company_604438000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/21/20250320_company_798363000.pdf',
      href: 'https://stock.pstatic.net/stock-research/company/16/20250319_company_212300000.pdf',
    };

    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
    const pdfFile = await pdf(item.data, { max: 2 });

    const prompt = GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED.replace(
      '{{PDF_EXTRACTED_TEXT}}',
      pdfFile.text,
    );

    const response = await ollamaService.invokeMultimodal({ prompt });
    console.log(response);
  });
});
