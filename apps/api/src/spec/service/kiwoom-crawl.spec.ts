import axios from 'axios';
import pdf from 'pdf-parse';
import { PDF_PARSING_PROMPT } from '../constants';
import { Test, TestingModule } from '@nestjs/testing';
import { ClaudeService } from '@libs/ai';
import { format } from 'date-fns';

const item = {
  pageNo: null,
  pageSize: 15,
  totalCount: null,
  startRow: null,
  endRow: null,
  f_key: null,
  f_keyField: null,
  rnum: 0,
  sqno: 740,
  // titl: '핀둬둬(PDD.US): 3Q24 예상치 하회. 현실이 된 우려',
  titl: '[실적리뷰]프리포트 맥모란(FCX.US) 기대와 우려의 공존',
  expl: '핀둬둬(PDD.US): 3Q24 예상치 하회. 현실이 된 우려',
  workId: '박주영',
  workEmail: null,
  readCnt: 389,
  makeDt: '2024.11.22',
  attaFile: '1732256684623.pdf',
  attaFileName: '241122_PDD.pdf',
  ivstOpin: 'Not_Rated(Not_Rated)',
  wingsSqno: '0000012|',
  relItemList: 'NDPDD',
  tpobNm: null,
  contL: null,
  itemNm: null,
  fseCdList: null,
  workIdList: null,
  today: null,
  stdate: null,
  eddate: null,
  isNew: 'N',
  brodId: null,
  fnGb: null,
  isScrap: 'N',
  prevSqno: 0,
  nextSqno: 0,
  prevTitl: null,
  nextTitl: null,
  prevMakeDt: null,
  nextMakeDt: null,
  no: 5,
  rSqno: 4147537,
  rMenuGb: 'CC',
  rMenuGbNm: '미국 산업/기업분석',
};

describe('kiwoom-crawler', () => {
  let claudeService: ClaudeService;

  beforeAll(async () => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaudeService],
    }).compile();

    claudeService = module.get(ClaudeService);
  });

  it('parsing', () => {
    const { titl, attaFile, makeDt } = item;

    const regex = new RegExp(/\(.+(\.|\s)\w{2}\)/);
    const { '0': match, index } = titl.match(regex);
    const nameRegex = new RegExp(/\[.+\]/);
    const stockName = titl?.substring(0, index)?.replace(nameRegex, '');
    console.log(stockName);

    const [code, market] = match
      ?.replace('(', '')
      ?.replace(')', '')
      ?.split(/\.|\s/);

    console.log(code);
    console.log(market);

    const url = new URL('https://bbn.kiwoom.com/research/SPdfFileView');
    url.searchParams.set('rMenuGb', 'CC');
    url.searchParams.set('attaFile', attaFile);
    url.searchParams.set('makeDt', makeDt);

    console.log(url.toString());

    const date = format(new Date(makeDt), 'yyyy-MM-dd');
    console.log(date);
  });

  it('list', async () => {
    const form = new FormData();
    form.append('pageNo', '1');
    form.append('pageSize', '30');
    form.append('stdate', '20240601');
    form.append('eddate', '20241201');
    form.append('f_keyField', '');
    form.append('f_key', '');
    form.append('_reqAgent', 'ajax');

    const response = await axios.post(
      'https://bbn.kiwoom.com/research/SResearchCCListAjax',
      form,
    );
    const items = response?.data?.researchList || [];
    const reports = [];
    for (const item of items) {
      const { titl, attaFile, makeDt } = item;

      const regex = new RegExp(/\(.+(\.|\s)\w{2}\)/);
      const { '0': match, index } = titl?.match(regex) || {};
      if (!match) {
        continue;
      }

      const stockName = titl?.substring(0, index)?.replace(/\[.+\]/g, '');

      const [code, market] = match
        ?.replace('(', '')
        ?.replace(')', '')
        ?.split(/\.|\s/);

      const url = new URL('https://bbn.kiwoom.com/research/SPdfFileView');
      url.searchParams.set('rMenuGb', 'CC');
      url.searchParams.set('attaFile', attaFile);
      url.searchParams.set('makeDt', makeDt);

      reports.push({ title: titl, stockName, code, market });
    }

    console.log(1);
  });

  it('pdf summary', async () => {
    const item = await axios.get(
      'https://bbn.kiwoom.com/research/SPdfFileView?rMenuGb=CC&attaFile=1732256684623.pdf&makeDt=2024.11.22',
      { responseType: 'arraybuffer' },
    );
    const data = await pdf(item.data, { max: 2 });

    const query = PDF_PARSING_PROMPT.replace(
      '{{PDF_EXTRACTED_TEXT}}',
      data.text,
    );

    const response = await claudeService.invoke(query);
    console.log(response);
  });
});
