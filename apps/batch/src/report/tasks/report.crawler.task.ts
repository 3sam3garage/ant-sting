import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { Injectable } from '@nestjs/common';
import { eucKR2utf8 } from '@libs/common';
import { REQUEST_HEADERS } from '../constants';

@Injectable()
export class ReportCrawlerTask {
  private readonly N_PAY_RESEARCH =
    'https://finance.naver.com/research/invest_list.naver';

  async exec(): Promise<void> {
    const response = await axios.get(`${this.N_PAY_RESEARCH}?&page=2`, {
      headers: { ...REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    const root = eucKR2utf8(response.data);
    const html = parseToHTML(root);

    const rows = html.querySelectorAll(
      'table[summary="투자정보 리포트 게시판 글목록"] > tbody > tr',
    );
    // .map((row) => console.log(row.innerHTML));

    console.log(1);
    console.log(1);
    console.log(1);
  }
}
