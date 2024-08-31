import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { CorporationRepository } from '@libs/domain';
import unzipper from 'unzipper';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';
import { groupBy } from 'lodash';
import { parse as parseToHTML } from 'node-html-parser';
import {
  FILE_DOWNLOAD_HEADER,
  FINANCIAL_STATEMENT_COLUMNS,
  FINANCIAL_STATEMENT_TYPE,
} from '../constants';
import { FinancialStatement, RawFinancialStatement } from '../interface';

@Injectable()
export class FinancialStatementTask {
  private readonly URL = 'https://opendart.fss.or.kr/cmm/downloadFnlttZip.do';

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
    private readonly corporationRepo: CorporationRepository,
  ) {}

  private async figureDownloadableFileNames() {
    const res = await axios.get(
      'https://opendart.fss.or.kr/disclosureinfo/fnltt/dwld/list.do',
    );

    const html = parseToHTML(res.data);

    const fileNames = [];
    const anchors = html.querySelectorAll('tr td a');
    for (const anchor of anchors) {
      const onclick = anchor.getAttribute('onclick');

      const [match] = onclick.match(/([^']*\.zip)/);
      if (match) {
        fileNames.push(match);
      }
    }

    const financialStatementsByType = {
      [FINANCIAL_STATEMENT_TYPE.PROFIT_AND_LOSS]: [],
      [FINANCIAL_STATEMENT_TYPE.BALANCE_SHEET]: [],
      [FINANCIAL_STATEMENT_TYPE.CHANGES_IN_EQUITY]: [],
      [FINANCIAL_STATEMENT_TYPE.CASH_FLOW]: [],
    };

    for (const fileName of fileNames) {
      switch (true) {
        case fileName.includes('PL'):
          financialStatementsByType[
            FINANCIAL_STATEMENT_TYPE.PROFIT_AND_LOSS
          ].push(fileName);
          break;
        case fileName.includes('BS'):
          financialStatementsByType[
            FINANCIAL_STATEMENT_TYPE.BALANCE_SHEET
          ].push(fileName);
          break;
        case fileName.includes('CE'):
          financialStatementsByType[
            FINANCIAL_STATEMENT_TYPE.CHANGES_IN_EQUITY
          ].push(fileName);
          break;
        case fileName.includes('CF'):
          financialStatementsByType[FINANCIAL_STATEMENT_TYPE.CASH_FLOW].push(
            fileName,
          );
          break;
      }
    }

    return financialStatementsByType;
    // return fileNames;
  }

  async exec(): Promise<void> {
    const { balanceSheet } = await this.figureDownloadableFileNames();

    const sanitizedItems: FinancialStatement[] = [];
    for (const zipFileName of balanceSheet) {
      const res = await axios.get(this.URL, {
        params: { fl_nm: zipFileName },
        ...FILE_DOWNLOAD_HEADER,
      });

      const { files } = await unzipper.Open.buffer(res.data);

      for (const file of files) {
        const content = await file.buffer();
        const pathName = iconv.decode(file.pathBuffer, 'EUC-KR');
        // 연결 재무제표는 패스.
        // @todo 나중에 처리방안 고려.
        if (pathName.includes('연결')) {
          continue;
        }

        const text = iconv.decode(content, 'EUC-KR');
        const data: RawFinancialStatement[] = parse(text, {
          columns: FINANCIAL_STATEMENT_COLUMNS,
          delimiter: '\t',
          skipEmptyLines: true,
          trim: true,
          relaxColumnCount: true,
          from: 2,
        });

        const groupedData = groupBy(data, '종목코드');
        for (const [key, items] of Object.entries(groupedData)) {
          if (key.includes('null')) {
            continue;
          }

          const item = items.reduce((acc, item) => {
            const { 통화, 항목코드, 항목명, 항목값, ...rest } = item;
            acc = { fields: [], ...acc, ...rest };
            acc.fields.push({ 통화, 항목코드, 항목명, 항목값 });
            return acc;
          }, {} as FinancialStatement);

          sanitizedItems.push(item);
        }

        console.log(1);
      }
    }

    console.log(1);
  }
}
