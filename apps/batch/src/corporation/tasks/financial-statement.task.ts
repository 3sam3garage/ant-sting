import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import unzipper from 'unzipper';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';
import { groupBy } from 'lodash';
import { parse as parseToHTML } from 'node-html-parser';
import {
  FINANCIAL_STATEMENT_COLUMNS,
  FINANCIAL_STATEMENT_TYPE,
  FinancialStatement,
  FinancialStatementRepository,
  RawFinancialStatement,
} from '@libs/domain';
import { onlyDigits } from '@libs/common';
import { FILE_DOWNLOAD_HEADER } from '../constants';

@Injectable()
export class FinancialStatementTask {
  private readonly URL = 'https://opendart.fss.or.kr/cmm/downloadFnlttZip.do';

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
    private readonly financialStatementRepository: FinancialStatementRepository,
  ) {}

  private async figureDownloadableFileNames() {
    const res = await axios.get(
      'https://opendart.fss.or.kr/disclosureinfo/fnltt/dwld/list.do',
    );

    const { CHANGES_IN_EQUITY, CASH_FLOW, BALANCE_SHEET, PROFIT_AND_LOSS } =
      FINANCIAL_STATEMENT_TYPE;

    const html = parseToHTML(res.data);

    const fileNames: string[] = [];
    const anchors = html.querySelectorAll('tr td a');
    for (const anchor of anchors) {
      const onclick = anchor.getAttribute('onclick');

      const [match] = onclick.match(/([^']*\.zip)/);
      if (match) {
        fileNames.push(match);
      }
    }

    const financialStatementsByType = {
      [PROFIT_AND_LOSS]: [] as string[],
      [BALANCE_SHEET]: [] as string[],
      [CHANGES_IN_EQUITY]: [] as string[],
      [CASH_FLOW]: [] as string[],
    };

    for (const fileName of fileNames) {
      switch (true) {
        case fileName.includes('PL'):
          financialStatementsByType[PROFIT_AND_LOSS].push(fileName);
          break;
        case fileName.includes('BS'):
          financialStatementsByType[BALANCE_SHEET].push(fileName);
          break;
        case fileName.includes('CE'):
          financialStatementsByType[CHANGES_IN_EQUITY].push(fileName);
          break;
        case fileName.includes('CF'):
          financialStatementsByType[CASH_FLOW].push(fileName);
          break;
      }
    }

    return financialStatementsByType;
  }

  async exec(): Promise<void> {
    const { 현금흐름표, 재무상태표, 손익계산서, 자본변동표 } =
      await this.figureDownloadableFileNames();

    const { CHANGES_IN_EQUITY, CASH_FLOW, BALANCE_SHEET, PROFIT_AND_LOSS } =
      FINANCIAL_STATEMENT_TYPE;
    const fileNameWithType = [
      ...현금흐름표.map((fileName) => ({ fileName, type: CASH_FLOW })),
      ...재무상태표.map((fileName) => ({ fileName, type: BALANCE_SHEET })),
      ...손익계산서.map((fileName) => ({ fileName, type: PROFIT_AND_LOSS })),
      ...자본변동표.map((fileName) => ({ fileName, type: CHANGES_IN_EQUITY })),
    ];

    for (const { fileName, type } of fileNameWithType) {
      const res = await axios.get(this.URL, {
        params: { fl_nm: fileName },
        ...FILE_DOWNLOAD_HEADER,
      });

      const { files } = await unzipper.Open.buffer(res.data);

      for (const file of files) {
        const entities: FinancialStatement[] = [];
        const content = await file.buffer();
        const pathName = iconv.decode(file.pathBuffer, 'EUC-KR');
        // 연결 재무제표는 패스.
        // @todo 나중에 처리방안 고려.
        if (pathName.includes('연결')) {
          continue;
        }

        const text = iconv.decode(content, 'EUC-KR');
        let data: RawFinancialStatement[] = [];
        try {
          data = parse(text, {
            columns: FINANCIAL_STATEMENT_COLUMNS,
            delimiter: '\t',
            skipEmptyLines: true,
            trim: true,
            relaxColumnCount: true,
            from: 2,
          });
        } catch (error) {
          Logger.error(error);
        }

        const groupedData = groupBy(data, '종목코드');
        for (const [key, items] of Object.entries(groupedData)) {
          if (key.includes('null')) {
            // '[null]' 값이 들어오는 케이스가 존재
            continue;
          }

          const entity = FinancialStatement.create({ 유형: type });
          for (const item of items) {
            const { 통화, 항목코드, 항목명, 항목값, ...rest } = item;
            Object.assign(entity, {
              ...rest,
              종목코드: onlyDigits(item.종목코드),
              항목들: [...entity.항목들, { 통화, 항목코드, 항목명, 항목값 }],
            });
          }

          entities.push(entity);
        }

        if (entities.length > 0) {
          await this.financialStatementRepository.insertMany(entities);
        }
      }
    }
  }
}
