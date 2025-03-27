import { Test, TestingModule } from '@nestjs/testing';
import {
  AiModule,
  ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT,
  ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT,
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
      // 8-K
      // 'https://www.sec.gov/Archives/edgar/data/835324/000143774925007894/0001437749-25-007894-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/315374/000155837025003075/0001558370-25-003075-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1672909/000143774925007886/0001437749-25-007886-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/4962/000000496225000024/0000004962-25-000024-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1847367/000110465925021990/0001104659-25-021990-index.htm',

      // 4
      // 'https://www.sec.gov/Archives/edgar/data/1487718/000149315225010524/0001493152-25-010524-index.htm',
      'https://www.sec.gov/Archives/edgar/data/1610520/000161052025000013/xslF345X05/primary_doc.xml',
      // 'https://www.sec.gov/Archives/edgar/data/1671927/000141588925004602/xslF345X05/form4-02192025_090204.xml',
      // 'https://www.sec.gov/Archives/edgar/data/753308/000106299325002690/xslF345X05/form4.xml',
      // 'https://www.sec.gov/Archives/edgar/data/1574197/000157419725000028/0001574197-25-000028-index.htm',

      // 엄청 긴거
      // 'https://www.sec.gov/Archives/edgar/data/1114446/000183988225016087/ubs_424b2-08361.htm',
    );
    const html = parseHTML(document);
    const body = html.querySelector('body');
    const content = body?.innerHTML ? body?.innerHTML : html?.innerHTML;
    const prompt = ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      content,
    );

    const response = await ollamaService.invoke({ prompt });
    console.log(response);
  });

  it('analyze pdf multimodal', async () => {
    const summary = {
      // href: 'https://stock.pstatic.net/stock-research/company/2/20250320_company_604438000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/21/20250320_company_798363000.pdf',
      href: 'https://stock.pstatic.net/stock-research/company/16/20250319_company_212300000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/62/20250319_company_986497000.pdf',
    };

    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
    const imageResponse = await fromBuffer(item.data).bulk([1, 2, 3], {
      responseType: 'base64',
    });

    const response = await ollamaService.invoke({
      prompt: GEMMA_ANALYZE_PDF_STOCK_REPORT,
      images: imageResponse.map((image) => image.base64),
    });
    console.log(response);
  });

  /**
   * mac mini 에선 gpu 가속이 텍스트만 된다.
   */
  it('analyze pdf in text', async () => {
    const summary = {
      href: 'https://stock.pstatic.net/stock-research/company/2/20250320_company_604438000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/21/20250320_company_798363000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/16/20250319_company_212300000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/62/20250319_company_986497000.pdf',
    };

    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
    const pdfFile = await pdf(item.data, { max: 2 });

    const prompt = GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED.replace(
      '{{PDF_EXTRACTED_TEXT}}',
      pdfFile.text,
    );

    const response = await ollamaService.invoke({ prompt });
    console.log(response);
  });

  /**
   * mac mini 에선 gpu 가속이 텍스트만 된다.
   */
  it('analyze economic-information', async () => {
    const infos = [
      '주요 뉴스\n- Summary: 트럼프 관세 강행, 주식시장 급락세로 전환. S&amp;P 500 -0.5%\n- 무난한 실적: 전날 애플 어닝 서프라이즈 + 애플 인텔리전스 기대감 속 애플 개장전 +4%.\n- 물가는 안도: 12월 근원 PCE 가격 전월대비 +0.2%, 11월보다 가팔라졌지만 시장은 개장 초 매수로 대응\n- 관세 부과: 백악관, 3월 관세설에 반박. 2월 1일 예정대로 멕시코-캐나다 25%, 중국 10% 관세 부과 공언\n- 트럼프 입장: 오후 등장한 트럼프, 캐나다 원자재 관세 부과 및 EU에도 관세 부과 엄포. 증시 급락세 전환\n- 업종: 경기소비재와 커뮤니케이션 제외한 전 업종 하락. 에너지 2.7% 급락. 관세 부과에 필수소비재 -1%\n- 개별주: 셰브론/엑슨모빌 4Q 어닝 쇼크에 급락. 중국 ADR들은 대중국 관세 부과 소식 후 급락 전환',
      '[전일 해외시장 요약]\n- 미국증시: Dow (-0.75%), S&amp;P500 (-0.50%), Nasdaq (-0.28%)\n- 미국증시, PCE 물가지수가 예상치 부합에도 트럼프 관세부가 계획 재확인에 하락 마감\n- 트럼프, 2/4일부터 캐나다·멕시코에 &nbsp;25%, 중국에 10% 관세 부과하는 행정명령 서명\n- 멕시코, 미국의 25% 관세 부과는 전략적 실수가 될 것이라고 경고',
      'Top down\n참신한 자산전략\n막혀버린 상-하방\n해외주식 Top picks\n월간 해외주식 탑픽 10선\n중국 주식전략\n2월 중국 주식전략: 승부처\n경제분석\n한국 수출입: 양호한 일평균 수출에도 관세 불확실성 부담\n채권전략\nFOMC 이후 한미 채권시장\n해외채권전략\n1월 ECB, 남아있는 강세 여력\nBottom up\n산업 분석\n보험 (비중확대) 삼성화재 밸류업 공시의 파급 효과&nbsp;\n삼성화재 (000810/매수) 밸류업 공시, 불확실성 보다는 기대감에 관심 필요\n기업 분석\n삼성전자 (005930/매수) 1분기가 올해 실적의 저점\n한국전력 (015760/매수) 4Q24 Preview: 환율이 아쉽다①\n한국가스공사 (036460/매수) 4Q24 Preview: 환율이 아쉽다②\n한전KPS (051600/매수) 4Q24 Preview: 배당을 빛나게 할 원전\n석경에이티 (357550/Not Rated) 나노 소재 국산화 선두주자\n해외기업 분석&nbsp;\n애플 (AAPL.US) AI(Apple Intelligence) 기대감 강화\n캐터필러 (CAT.US) 4Q24 Re 업황을 방어해낸 무난한 실적&nbsp;\n록히드마틴 (LMT.US) 4Q24 Re 영업이익 쇼크, ’25년을 기대\n인텔 (INTC.US) 최대 숙제는 기술 리더십 회복\n캡콤 (9697.JP) &lt;몬스터헌터 와일즈&gt;만 믿고 간다\n신한 속보\n딥시크-신한IT코멘트 정리',
      '비AI 분야로 포트폴리오 이동\n2025년 1월 넷째주(25.01.27~31), 미국 NASDAQ은 전주대비 1.6% 하락, 국내 코스피(KOSPI)와 코스닥(KOSDAQ)은 1주일 동안 각각 0.8%, 0.1%씩 하락. 중국의 딥시크 영향으로 AI 관련주인 엔비디아, 브로드컴은 큰 폭으로 하락. SK하이닉스도 1/31(금)에 9.9%, 삼성전자도 2.4% 하락, 반도체 관련 소부장 기업도 약세를 시현. 반면에 비AI 분야, 애플의 양호한 실적 발표로 삼성전기는 4.7% 상승, LG이노텍은 보합(0.1% 상승), LG디스플레이는 2.2% 상승(1/13 금). 반도체보다 휴대폰 부품 분야로 포트폴리오 다변화 진행 미국 테슬라가 자율주행 서비스를 2025년 6월 실시, 또한 옵티머스(휴머노이드) 생산 계획을 발표. 현대자동차(보스턴다이내믹스도 휴머노이드를 글로벌 생산기지에 2026년 활용할 계획을 발표). 자율주행과 휴머노이드 관련 기업의 주가가 강세를 시현. 또한 AMD가 2026년에 유리기판 적용을 2026년 시제품, 2028년 양산 목표 일정을 공유한 언론보도. CES2025 주목하였던 차세대 성장 분야가 주목 받음',
      '미디어 업종 주간 동향\n- 긴 연휴 동안 주요 컨텐츠의 성과가 크게 개선되지 않아서 주가도 여전히 부진한 상황. 12월말~1월초에 시작된 주요 작품들이 종방을 향해가고 있어서 결국 다음 작품의 성과를 기다려야 하는 상황. 4Q 실적도 계절적 요인 등으로 연중 가장 부진한 실적들이 예상되기 때문에, 미디어 업종의 반등은 다소 시간이 걸릴 것\n- 4Q 실적이 가장 양호한 기업은 CJ ENM과 제일기획. ENM은 티빙의 가입자 이탈에도 불구하고 Fifth Season의 성과 개선과 음악/영화 성수기 효과가 더해지면서 700억원대의 우수한 이익을 달성할 것으로 전망\n- 제일기획은 견조한 삼성 물량에 더해 자회사들의 비계열 광고 물량 수주가 이어지면서 역시 800억원대의 견조한 실적 전망\n- 실적 시즌에 미디어 업종이 돋보이기는 쉽지 않으나, 25년 개선 되는 광고 업황과, 역대 최대 성과를 거둔 넷플릭스의 실적이 증명하듯 한국 컨텐츠에 대한 수요는 견조하기 때문에, 4Q 실적 이후부터는 상황이 호전될 것으로 전망',
      '통신서비스 업종 주간 동향\n- 통신 주간 +1.4%, KOSPI -0.8%. YTD 통신 +3.3%, 지수 +4.9%\n- 지난 주 KT의 시총이 03.5월 이후 처음으로 SKT의 시총을 상회한 후 금일 시총 격차 확대. 당사는 시총 격차가 더 확대되기 보다는, SKT와 LGU+가 동반 상승하는 선순환 기대. KT의 5G 감가비 감소가 먼저 나타나지만, 결국 3사 모두에게 해당되는 이익 개선 효과이기 때문\n- 2/6 LGU+를 시작으로 통신사 실적 발표 시작. 2/12 SKT, 2/13 KT 예정. 이미 4Q 일회성 비용을 반영한 실적 부진으로 연초 주가는 지수대비 약세를 보이고 있지만, 실적 확인하면서 25년 더 개선된 실적 전망에 대한 기대감이 유입되는 과정에서 본격적인 상승 전망\n- 2월에 눈여겨 볼 포인트: 4Q 실적, 25년 전망, 갤S25 출시에 따른 마케팅 경쟁 여부, 통신3사 담합 관련 공정위 과징금 부과 여부',
      '배출권/에너지 관련 뉴스\n[뉴욕유가] 트럼프 관세 주시하며 출렁…WTI 0.3%↓\nhttps://www.yna.co.kr/view/AKR20250201006900009?section=search\n은행·보험사·기금도 탄소배출권 시장 참여 가능해져\nhttps://www.yna.co.kr/view/AKR20250131074100530?input=1195m\nCOP30 앞두고, 2035년 NDC 잇달아 발표…영국은 81% 감축 목표 제시\nhttps://www.impacton.net/news/articleView.html?idxno=13877',
      '국내 증시 Comment\n딥시크발 하락: 추석 연휴 기간동안 미 증시의 딥시크발 충격에 국내 증시 직격탄 맞으며 코스피(-0.77%), 코스닥(-0.06%) 일제히 약보합 마감. 특히, 엔비디아 밸류체인에 속해 있는 SK하이닉스(-9.86%), 한미반도체(-6.14%) 등이 급락하면서 반도체 업종의 약세장이 연출되었음. 이와 반대로 딥시크가 상대적으로 적은 투자로 고성능 AI 모델을 개발하면서 자본이 적은 국내 소프트웨어 업체에 대한 기대감이 상승하면서 네이버(6.13%), 카카오(7.27%) 등 AI 소프트웨어, 서비스 업종은 급등하는 모습을 보임\n관세 리스크: 트럼프 대통령이 캐나다, 멕시코 25%, 중국 10% 관세 부과를 선포하면서 국내 관세 리스크 확대될 것으로 전망. 국내 반도체, 이차전지 등 수출 업종의 변동성 확대 예상',
      '미국 - 트럼프 행정부 관세 우려에 하락 마감\n- 장초 12월 개인PCE 물가지수 긍정적 해석으로 상승했으나, 캐나다·멕시코·중국 관세 부과 방침 재확인에 하락',
      '국내 및 글로벌 증시 동향 (휴장: 중국, 홍콩)\n[미국 증시 동향]\n- 트럼프 관세 위협이 현실화됨에 따라 분위기 반전, PCE 결과 소화하며 상승 출발했던 증시는 하락 전환 마감\n- 12월 헤드라인과 근원 PCE는 각각 +0.3%, +0.2% MoM, 대체로 예상치 부합하며 장 초반 매수 심리 강화\n- 그러나 트럼프 정부가 예정대로 캐나다와 멕시코, 중국에 관세를 부과하겠다고 밝히면서 투자심리 급격히 위축\n- 애플 (-0.67%), 4분기 매출과 순이익 모두 예상치 상회했으나 아이폰 판매 부진과 관세 이슈 반영하며 하락\n[FICC 시장 동향]\n- 미국 10년물 국채수익률 4.54% (+2.2bp), 캐나다와 멕시코, 중국 관세 부과에 대한 종전 입장 재확인에 상승\n- 달러 인덱스 108.37 (+0.53%), 관세 부과 관련 보도와 백악관 입장에 큰 변동성 보인 끝에 상승 마감\n- 유가 72.53달러/배럴 (-0.27%), 관세 이슈에 장 중 급반등했으나 불확실성이 여전하다는 인식에 소폭 하락\n[중국 및 유럽 증시 동향]\n- 중국 증시, 춘절 연휴 휴장\n- 유럽 증시, 기업실적 호조로 상승. 범유럽지수 STOXX 600 기준 1월 +6.29%로 S&amp;P 500 수익률 상회\n[오늘의 관전 포인트]\n- 트럼프 대통령은 캐나다, 멕시코에 25%, 중국에 10% 보편 관세 부과하는 행정명령에 서명, 관련 영향 불가피\n- 딥시크 충격 여파도 이어질 가능성, 젠슨황 엔비디아 CEO는 트럼프와의 면담에서 AI칩 수출 통제 강화 논의\n- 이번 주 제조업 및 고용 지표, 주요 연준 인사들의 연설 다수 예정되어 있어 통화정책 결정 변수들에 주목 필요',
      '[Week Ahead]\n- 지난 주 글로벌 증시는 대체로 부진. 한국과 중화권 중심으로 설날 연휴가 있어 휴장 일정이 길었던 와중 중국 Deepseek가 미국 앱스토어에서 다운로드 1위를 차지. 저렴한 개발비용 부각되며 미국 중심의 AI CAPEX 지출 지속성에 대한 우려 커지며 관련주 중심으로 급락했고 금요일 하루 열린 국내 증시도 반도체/기계 등 관련주 중심으로 조정이 크게 나오는 것을 확인\n- 시장의 공포는 일시적으로 크게 나타났으나, 기업&gt;섹터&gt;인덱스로 갈수록 변동성이 낮아지는 것은 확연히 드러남. 시장 전체보다는 특정 업종/테마로 제한. 분명 엔비디아 중심의 생성형 AI가 2년 넘게 시장을 끌고 온 것은 맞으며 완전히 무시할 수 있는 이벤트는 아니겠으나 일단은 이번 사건으로 전체적인 내러티브의 심각한 훼손보다는 테마 안에서의 내부적인 움직임으로 해석\n- 이번 주부터는 딥시크 사태가 시장에 주는 영향은 제한적일 것으로 생각하며 트럼프의 중국/캐나다/멕시코 관세 부과와 이에 맞서는 보복 관세 등으로 나오는 노이즈들, 그리고 계속되는 실적시즌과 주요 경제지표들의 영향력이 더 큰 국면 전개 예상\n- 이번 주 주요 실적: 미국은 알파벳(수요일 새벽), 아마존(금요일 새벽), 일라이릴리(목요일 장전) 등이 예정되어 있으며 글로벌로는 노보노디스크(수요일 장전), 도요타(수요일) 등이 있음. 국내는 금융주와 통신주 중심으로 실적 발표 일정이 잡혀 있고 경제 지표는 미국 재무부의 리펀딩 계획(월요일, 수요일), ISM제조업지수(화요일 새벽)와 미국 고용지표(금요일 저녁) 등에 주목(일정은 8-12p 참고)\n- 연준은 1월 FOMC에서 만장일치 기준금리 동결 및 기존 QT 지속 등 스탠스를 고수. 연준의 비협조적인 태도 계속될 가능성 높아진 상황이라면 재정정책에 또 기대해 볼 수밖에 없는 시점인데 미국 재무부의 분기 리펀딩 계획 발표가 이번 주 월요일(3일)과 수요일(5일) (미국 현지 시간 기준)에 예정되어 있음. 수치 공개 이후 상반기 동안 재정정책에서 나올 증시 유동성 효과 전망치 업데이트 예정(관련 내용은 재정정책 유동성 효과의 지속가능성 점검 - Treasury Net Liquidity(TNL)(1/16), https://buly.kr/8ekgGIf 참고)\n- 국내 증시가 1월 한달간 글로벌 증시를 아웃퍼폼(YTD 코스피+4.94%, S&amp;P 500 +2.93%, 니케이225 +0.68%)했으나 여전히 수급은 텅텅 비어 있음. 외국인 YTD 코스피 수급은 현물 -9,300억원대, 선물 -1.7조원대로 외국인 수급이 받쳐주지 않는 상황 속에서 오른 것. 외국인 수급은 원화의 달러 대비 강세와 함께 폭발적으로 들어올 가능성이 여전히 높음. 시점과 트리거를 단정짓기 어렵지만 현재 비어 있는 외국인 수급 상황과 펀더멘털이 가격 보상을 적절히 받지 못한 점(실적시즌 거치며 추정치 내려가고 있으나 코스피 영업이익 재작년 대비 작년 48%대 증익, 작년 대비 올해 19%대 증익 예상)을 감안한다면 최소 비중 유지가 합리적\n- 중국 본토 증시는 춘절 연휴로 2/4까지 휴장 예정. 매매 일정에 참고할 필요',
      '지난 주, DeepSeek 파급효과와 국내 소프트웨어 업종 강세\n『DeepSeek 파급효과, Follower 로써의 한국(1/31)』 자료에서 국내 기업들이 저비용·고성능 AI 를 개발할 가능성에 주목하며, 이에 따라 소프트웨어 업종의 단기적인 강세를 전망했다. 실제로 시장도 비슷하게 반응하여, 반도체·하드웨어 등 AI개발 선구자와 관련된 밸류체인이 약세를 보인 반면, 인터넷·소프트웨어 업종을 중심으로는 강세가 두드러졌다.',
      'DeepSeek·FOMC·빅테크 실적 소화\nKOSPI, KOSDAQ은 각각 0.8%, 0.5% 하락했습니다. 설 연휴 기간 간 1)DeepSeek 충격, 2)FOMC, 3)빅테크 실적 발표를 소화하며 전약후강을 보였습니다. DeepSeek V3를 미세조정한 R1 공개(비용은 GPT4의 1/4, 성능은 OpenAI o1과 유사) 이후 막대한 CapEx 투자에 대한 의구심이 생기자 AI HW 중심 하방 충격이 나타났습니다(삼성전자 -2.4%, SK하이닉스 -9.9%, HD현대일렉트릭 -7.9% 등). 또한 Trump 정부가 Nvidia의 중국 저사양 반도체 수출 규제 강화를 검토한다는 소식도 충격을 키웠습니다. Biden이 확정한 반도체법 보조금도 Trump 정부 상무장관 지명자가 검토가 필요하다고 하며 지급 시기의 불확실성을 더했고, 미국의 캐나다·멕시코 관세 부과가 임박한 점도 한국에 경계 요소로 작용했습니다.',
      '딥시크 AI 모델 공개에 엔비디아 등 미국 빅테크 충격\n중국의 AI 스타트업 딥시크 (DeepSeek)가 저비용, 저사양칩으로 오픈AI의 챗GPT를 능가하는 AI 모델을 선보임에 따라 전세계의 관심이 이에 쏠리고 있다. 지난해 12월 대규모언어모델(LLM) V3를 출시한데 이어, 1월 20일 추론 모델 R1을 공개했다. 이러한 영향으로 이번 주 엔비디아 등 AI 관련주들의 주가 변동성이 지속되었으며, 특히 연휴 기간 동안 (5거래일간) 엔비디아가 15% 이상 하락했으며 27일 하루에만 시가총액 약 1조 달러가 증발했다.',
      '장 마감 코멘트\n- KOSPI 2,517pt (-0.77%), KOSDAQ 728pt (-0.06%)\n- 연휴 동안의 FOMC, 딥시크 이슈, 빅테크 실적 발표 등 여러 이벤트를 반영 하며 하락\n- 1월 FOMC에서 예상대로 금리가 동결된 가운데 12월보다는 완화적이라는 평가이며 연준의 추가 인하 시점은 2분기 중으로 판단\n- 한편, 중국의 AI 스타트업 딥시크 (DeepSeek)가 저비용, 저사양칩으로 오픈AI의 챗GPT를 능가하는 AI 모델을 선보임에 따라 전세계의 관심이 집중됐으며, 시장 지배력 약화 우려로 엔비디아가 연휴 동안 15% 이상 급락하는 등 미국 빅테크들의 변동성 확대\n- 국내 역시 엔비디아에 고사양 HBM을 공급하는 SK하이닉스가 9%대 급락, 삼성전자 -2%대 등 AI 하드웨어 기업 동반 약세. 반면, 딥시크 등장에 따라 그동안 인프라 투자 비용 제약으로 개발이 제한적이었던 AI 소프트웨어 업체들의 강세가 두드러짐\n- 딥시크의 모델 훈련 데이터 무단 수집 의혹, 저가칩 이용 개발 진위 여부 등 논란이 존재하고 관련 산업에 기회요인과 위험요인이 모두 공존하겠으나, AI 관련 하드웨어에서 소프트웨어로의 시장 관심 이동 등 궁극적으로는 AI 생태계 확장에 긍정적인 영향이 예상\n- 한편, BOJ (인상), FOMC (동결), ECB (인하) 금리 결정이 마무리된 가운데 2월 1일부터 미국의 캐나다, 멕시코향 25% 관세 부과 시행 예정 등 국내외 증시는 당분간 트럼프 행정부의 관세 정책 및 딥시크 영향 하에 등락 보일 전망\n- 오늘 밤 미국 PCE 물가, 다음 주 제조업지수, 고용보고서 등 금리 결정 변수들에 주목',
      'Top Picks\n◆ 인튜이티브 서지컬(ISRG.US): 현재 주가 580.2달러\n- 1) 지속 성장하는 수술로봇 시장에서 독보적 입지. 특히 복강경 수술로봇 시장의 점유율은 90% 이상으로 시장 성장과 따른 실적 성장세 유지될 전망. 2) 올해 초 FDA의 승인 받은 다빈치 시스템 5세대의 빠른 출하량. 매출 증가와 함께 수익성 개선 가능\n◆ 일라이 릴리(LLY.US): 현재 주가 823.2달러\n- 1) 비만치료제 공급 부족 완화로 4분기 실적 반등 기대감, 2) 중국에서 알츠하이머 치료제 승인. 내년 유럽에서 승인 가시화되고 있어 2025년 상반기 부터 알츠하이머 치료제 호재 주가 반영. 3) 바이든 대통령 비만약 보험 적용 법안 상정, 경구 비만약 임상 등 비만약 투심 반등 요인 존재',
      '■ 시장 리뷰 &amp; 코멘트\n▶ 한국 증시\n코스피지수는 전장대비 19.43pt (-0.77%) 하락한 2,517.37pt에 마감. 美 기준금리 동결 및 딥시크 충격에 반도체 관련주 중심으로 낙폭 확대되며 하락 마감\n▶ 미국 증시\n다우지수는 전장대비 337.47pt (-0.75%) 하락한 44,544.66pt에 마감. 트럼프 대통령의 관세 강행에 투자심리가 위축되며 하락 마감\n▶ 아시아 증시\n닛케이지수는 전장대비 58.52pt (+0.15%) 상승한 39,572.49pt에 마감. 반도체 관련주 중심으로 딥시크발 낙폭 과대에 따른 저가 매수세 유입되며 상승 마감\n상해종합지수 춘절 휴장',
      '글로벌 이익 동향 및 실적추정치 상, 하향 종목\n&nbsp;\n미국 실적모멘텀 약화 2주차. 에너지(쉘, 필립스66, 옥시덴탈페트리움 등) 및 금융(비자, 웰스파고, 아메리칸익스프레스 등) 섹터가 상향, 커뮤니케이션(메타, AT&amp;T) 및 소재 하향, IT는 약보합. 반도체 업종은 소폭 하향 전환(인텔과 삼성전자의 하향 기여도가 가장 컸음, 그 다음이 서비스나우, T.I.), 다만 마이크로소프트, 엔비디아, SAP SE, ASML, IBM 등은 여전히 상향 조정. 테슬라의 실적 하향폭은 가장 큰 수준, 지난 4분기의 10% 가까운 어닝 미스 및 전기차 보조금 축소로 판매량 하향 가능성 부각, BYD 등 전기차 경쟁 심화 등의 영향. 인텔 역시 실적 하향폭 큰 수준, 작년 4분기 실적은 적자전환되었고 올해 1분기 가이던스 역시 하향, 경영진 교체의 불확실성과 파운드리 사업의 손실 반영 등의 영향. 상향 업종은 운송인프라, 카드, 유통, 상사, 항공, 투자은행, 소프트웨어, 유틸리티, 에너지, 은행. 하향 업종은 항공물류운송, 내구제, 화학, 해운, 상호미디어, 통신, 기술하드웨어, 금속/광물, 자동차',
      '[요약] 누가 주도주가 될 것인가\n&nbsp;\n- 미국의 관세 부과를 피할 수는 없지만, 관세가 부과 될 경우 미국 내 수입 물가 상승을 자극할 가능성과 2017년 집권 1기 초기에 비해 현재 국제 유가, 미국 CPI와 시중금리가 높아 관세에 대한 저항이 미국 내에서 심할 수 있다는 점도 염두에 둘 필요가 있다.\n- 현재 2017년 집권 1기 초기보다 낮은 제조업 체감 및 투자 경기 개선에 집중할 수 있다는 점에도 초점을 맞출 필요가 있다. 인프라 투자 시 세액 공제, 인프라 투자 확대, 규제 개혁, 법인세 인하 등과 같은 정책 카드도 있다.\n- 딥시크의 부각으로 인해 미국 Tech 섹터의 증시 주도권이 흔들릴 수 있다는 우려가 있지만, 아직은 시기상조다. 2000년 초반 S&amp;P500 내 Tech섹터의 이익 비중은 24%였지만, 현재는 35%다. 시가총액 비중은 당시와 비슷한 40% 수준이다. 과열일 수는 있지만, 버블이라고 보기는 어렵다.',
      '2QFY25 실적 리뷰\n&nbsp;\nAzure 매출 기대치 하회는 Non-AI 부문이 요인, AI 매출은 기대치 상회\n- FY25년 2분기(10~12월) 매출과 EPS는 기대치를 상회하는 견고한 실적 추이를 이어갔으나 2분기 Azure 매출과 3분기 Azure 가이던스가 시장 컨센 하회\n- 2분기 Azure 매출 성장은 31%(환율영향 제외)로 가이던스 하단(31~32%) 수준, 분기 가이던스는 31~32%\n- Azure 매출에서 AI 서비스 성장 기여는 13pt로 예상치(12pt)를 상회, Non-AI 부문에서 파트너사를 통한 고객사의 클라우드 이전 관련 매출이 기대치 하회 요인.\n- AI와 Non-AI에 대한 세일즈 조정과 직접/간접 세일즈 비중 변화 때문이며 AI와 Non-AI 균형을 맞추기 위한 조정이 하반기에도 일정 부분 영향을 줄 것으로 가이던스에 반영',
      '미국 민간투자 회복 전망 → 대선 불확실성 종료, Deepseek 출현\n&nbsp;\n- 미국 경제는 여전히 소비와 서비스업이 주도하는 양상이다. 4Q24 지출별 GDP 성장률은 개인소비(+4.2%, q/q)와 민간투자(-5.6%)의 괴리가 재차 확대됐고, 민간투자 부진은 전체 성장률이 컨센서스를 하회(실제치 +2.3% vs 컨센서스 +2.6%)하는 결과로 연결됐다. 코로나 이후 미국 경제는 이전소득과 정부지출에 기반한 호황을 누렸으나, 현재까지는 선순환에 실패한 모습이다.\n- 이러한 모습은 경기 호황의 연속성에 대한 의구심을 자아내고 있으나, 2025년 미국의 민간투자는 회복될 가능성이 높다는 판단이다. 최근의 투자 부진은 트럼프의 선전이 아닌 아닌 대선이라는 불확실성 그 자체에 원인이 있었고(해소), Deepseek의 출현으로 인해 향후 중국과의 기술 격차를 확대하기 위한 지원이 더해질 것으로 예상되기 때문이다.',
      '트럼프 행정부의 관세 정책은 이미 시작\n트럼프 행정부가 캐나다와 멕시코에는 25%, 중국에는 10%의 추가 관세 부과 계획을 발표했다. EU를 대상으로도 관세 부과 가능성을 시사했다. 캐나다는 국경 강화 계획을 발표했고, 멕시코도 불법 이민 문제에 적극적으로 나서겠다는 입장을 공개했으나, 예상보다도 강경한 정책이 공개됐다다. 미국도 영향은 불가피 캐나다, 멕시코, 중국, EU는 미국 무역 적자에 60% 이상을 차지하는 지역으로 네 곳의 관세가 트럼프 행정부가 제시한 수준으로 반영될 경우 미국의 평균 관세율은 3%에서 13%까지 높아질 것으로 추정된다. 수입 물가 상승은 단순히 미국의 인플레이션 압력을 높이고, 고금리-강달러 기조 장기화 부담을 키우는 것 뿐만 아니라 추가 관세 부과 지역에서의 수입이 감소와 글로벌 교역 구조 변화에 영향을 미칠 수 밖에 없다. 피터슨국제경제연구소(PIIE)에 따르면 멕시코와 캐나다에 25%의 관세를 부과할 시 미국의 2026~2029년 GDP 성장률은 매년 0.2%p 낮아지고, 2025년 인플레이션은 0.4%p 높아질 것으로 추정된다. 캐나다산 원유 관세를 낮출 가능성도 함께 시사된 만큼 아직까지는 장기적 영향보다 우선 최종 정책 불확실성이 미국 금융 시장에 영향을 미칠 것으로 예상한다. 미국의 관세 정책은 단기가 아닌 중장기 대응이 필요 미국의 관세 정책은 일회성이 아니라 중장기적 관점에서 대응해야 한다. 일부 국가를 대상으로 우선적 정책이 공개됐으나, 유럽, 일본, 콜롬비아, 베트남 등의 국가에도 추가적인 정책이 공개될 가능성이 높기 때문이다. 전면적인 보편관세가 논의되는 가운데 국가별로 선별적 정책이 공개됐고, 유예 기간 및 정책 수정 가능성도 함께 열어두고 있다는 점도 고려해야 한다. 주말 백악관의 발표와 동시에 미국 이외 국가들의 외교 정책들이 연이어 공개되고 있다. 2월 중에는 미국의 이외 국가들의 정책에 대응하는 전략도 고려해야 한다. 중장기적으로는 무역 구조 변화 속에서 수혜가 기대되는 국가/업종을 선별해야 한다. 정책 부담 제한적인 업체 중심의 선별적 대응 유효할 전망 일시적으로는 미국 증시 전반에 위험자산 투자심리가 위축될 가능성이 높다. 단기적으로는 대형 기업들의 실적 발표와 고용 지표가 연이어 예정돼 있다는 점도 부담이다. 미국 증시는 일시적 조정 이후 반등하는 흐름을 예상한다. 일시적 조정 시에도 업종별로는 차별화된 대응이 필요하다. 스타일별/대표 업종별 대응이 유효했던 2024년과 달리 동일 업종 내에서도 관세 정책 부담이 제한적인 업체를 선별해야 한다. 상대적으로 관세 부담이 제한적인 업체는 IT 업종 내 AI/소프트웨어, 커뮤니케이션, 대형 금융, 미국 인프라주, 글로벌 방산, 리테일 기업(25/1/20, 트럼프 2기 준비하기)이다. 세부 업종별 대응 전략 우선적으로 트럼프 행정부의 관세 정책 영향이 클 것으로 예상되는 업종은 IT와 에너지다. 관세 정책에 노출되어 있는 기업 비중이 크기 때문이다. IT 기업 중에서는 관세 정책 부담이 큰 반도체/제조업체 보다 정책 수혜가 기대되는 AI/소프트웨어 기업의 상대적 매력도가 높다고 판단한다. 대형 성장주 중에서도 커뮤니케이션 기업은 상대적으로 관세 정책 부담이 제한적이라는 점에서 반도체 기업과의 탈동조화 기조가 이어질 것으로 예상된다. 에너지 기업 중에서는 캐나다산 원유 공급 불확실성이 이어질 것으로 예상되는 만큼 대형 에너지주보다 에너지 운송/가스 공급 기업 등으로 선별적으로 접근하는 전략이 유효할 전망이다. 산업재, 금융, 유틸리티 기업은 미국 매출 비중이 높다는 점은 긍정적이나, 관세 정책에 따른 고금리 기조 장기화 영향이 반영될 것으로 예상한다. 산업재 기업 중에서는 미국 트럼프 행정부의 인프라 투자 증대 수혜주, 글로벌 방위비 증대 기대 업체, 금융주 중에서는 고금리 장기화 부담이 제한적인 대형주가 양호할 것으로 예상되며 유틸리티 업체는 단기 트레이딩 매매 차원의 대응이 필요하다. 경기소비재 기업 중에서는 리테일 업체를 상대적으로 선호하며, 홈빌더 등 국채금리 상승 부담이 큰 업체는 일시적 조정 가능성에도 유의해야 한다. 소재 기업도 고금리 장기화 부담은 이어질 것으로 예상되나, 밸류에이션 부담이 낮은 만큼 단기 반발 매수세가 여러 번에 걸쳐 유입될 가능성이 높다는 점을 고려해야 한다. 헬스케어 기업은 무역 갈등 영향은 상대적으로 제한적이나, 향후 의약품 관세 부과 가능성이 시사됐다는 점이 주가 상승을 제한할 것으로 예상된다. 필수소비재는 외교 불확실성 확대 시에도 대응 가능한 내수주 비중이 높다는 점은 긍정적이나, 원재료 수입 부담이 낮은 업체 중심의 선별적 대응이 필요하다. 부동산(리츠) 업종은 관세 정책의 직접적 영향보다도 고물가 장기화 영향이 주가 상승을 제한할 전망이다.',
      '2월 자산전략\n&nbsp;\n2월 금융시장은 방향성을 탐색하는 구간이 될 것으로 예상한다. 미국 관세정책의 불확실성이 아직 잔존함에 따라 트럼프 대통령의 발언에 금융시장의 주요 가격변수들은 당분간 민감하게 반응할 것으로 보인다. 하지만, 금융시장이 우려했던 급진적인 관세 부과 등 최악의 시나리오는 피할 것으로 예상함에 따라 급격한 조정 가능성도 낮게 본다. 주식과 채권, 외환시장의 변곡점이 형성되는 구간으로 판단한다. 금리와 환율의 급등세가 마무리되는 국면으로 접어드는 가운데 주식시장에서는 트럼프 관세 리스크에 대한 내성과 선반영 인식을 감안 시, 해당 리스크는 가격 조정보다 기간 조정에 그칠 것으로 예상한다.&nbsp;\n&nbsp;',
      'DeepSeek 쇼크와 시장의 엇갈린 평가\n&nbsp;\nDeepSeek 가 공개한 LLM 모델이 ‘저 비용’으로 GPT 수준의 ‘고 성능’ AI 모델을 만들 수 있음을 증명하자 시장은 크게 하락했다. DeepSeek 의 V3 모델은 훈련에 약 560 만 달러의 컴퓨팅 비용을 투자해 메타 Llama 3 모델 개발 비용 대비 1/10 을 줄였다. 이후 엔비디아를 포함한 반도체 관련 기업 주가는 급락했고 에너지, 유틸리티 섹터 내 기업들 역시 빠르게 하락했다. 시장은 DeepSeek 에 대해 Open AI 데이터 무단 도용 가능성, 인건비를 누락한 비용 집계 등 여러 의혹을 제기하고 있지만, 저비용 고성능 모델을 만든 기술력에 대해서는 인정하는 모습도 보이고 있다.\n&nbsp;',
      '2/1 트럼프 중국 관세 10% 인상 발표, 중국 경기 하방 압력 확대 전망\n&nbsp;\n- 2/1 트럼프 대통령은 국제비상경제권법(IEEPA)에 따라 중국에 10% 관세를 부과하는 행정명령에 서명했으며 2/4 부터 발효될 예정\n- 미국의 대중국 평균 관세율은 19%에서 29%까지 상승될 전망. 향후 관세 인상 세부 내용 및 중국의 대응 강도에 대한 확인이 필요하나 ‘24 년 높아진 수출의 중국 GDP 기여도를 감안하면 경기 하방 압력은 높아질 것으로 판단\n- 미국의 관세 인상과 관련해서 중국 상무부는 WTO 에 제소하고 이에 상응하는 반격 조치를 취할 것이라고 즉각적으로 대응한 상황',
      'FX: 유로화, ECB 금리 인하 기대에 하락\n&nbsp;\n달러화는 미국 PCE물가가 시장 예상치에 부합했던 가운데 트럼프의 관세 강행 방침이 재확인되면서 상승 미국 12월 PCE물가지수와 근원PCE물가는 각각, 전월대비 0.3%, 0.2% 로 전월보다 상승하였지만 시장 예상치에 부합. 트럼프 대통령은 예정대로 캐나다와 멕시코에 25% 관세, 중국에는 10% 추가 관계를 부과하겠다고 발표. 이에 트럼프의 관세 강행 방침이 재확인되면서 관련 우려와 안전자산 수요에 달러 상승. 유로화는 독일 물가 둔화에 ECB 추가 금리 인하 기대 높아지면서 달러 대비 하락 NDF 달러/원 환율 1개월물은 1,456.05원으로 1.55원 상승 출발할 것으로 예상하며 달러 상승 등에 소폭의 상승세를 보일 전망',
      '1. 지난 주 주식시장 동향\n&nbsp;\n국내 증시는 연휴 기간 내 딥시크 쇼크, 빅테크 기업 실적, 1월 FOMC 등의 이벤트를 소화하며 대형주를 중심으로 한 외국인 매물 대량 출회되며 하락 (KOSPI -0.77%, KOSDAQ -0.06%) 1/27일~30일 간 설 연휴로 국내 증시는 휴장한 가운데 글로벌 금융 시장 내에서는 딥시크 쇼크, 주요 빅테크 기업 실적 발표, 1월 FOMC 등의 주요 이벤트가 발생하며 금융시장 변동성이 확대되는 흐름 연출. 주 초반 중국의 AI 스타트업인 딥시크(DeepSeek)가 저비용으로 오픈 AI의 챗 GPT 모델과 견줄만한 성능을 갖춘 R1을 선보인 이후 AI 버블에 대한 우려가 불거지며 미 증시 내 AI 관련 테마주들의 급락을 야기. 딥시크 쇼크는 지난해부터 가파른 상승세를 보이며 밸류에이션 부담 압박을 받던 AI 테마주에 대한 명확한 차익실현 명분을 제공하며 27일 당일 반도체, 전력기기, 원전 등 AI 유관 테마는 대부분 급락세 연출. 다만, 이후 단기 낙폭이 과대했다는 인식 속 리테일 자금을 중심으로 한 저가 매수 자금 유입되며 AI 테마주들은 낙폭을 일부 회복. 여기에 메타와 마이크로소프트 등 주요 빅테크 기업들이 올해 AI 관련 CAPEX 지출 규모를 보다 더 늘릴 계획이라는 점을 밝힘에 따라 AI 투자 기조가 유효하다는 인식을 재확인한 점이 안도 요인으로 작용. 한편, 1월 FOMC는 성명서 문구에 인플레이션 진전에 대한 문구가 삭제되었다는 점이 변동성 확대 요인으로 작용하였으나 시장 예상대로 금리 동결을 선언함에 따라 대체로 시장에는 중립 재료로서 작용. 31일(금) 국내 증시는 설연휴 간 이벤트를 소화하며 AI 반도체, 전력기기 중심으로 외국인 매물이 출회되며 하락세를 보였으나, 바이오, 로봇, 소프트웨어 업종의 상승이 하락폭을 상쇄하며 우려 대비 지수의 낙폭은 제한. 업종별로 보험(+8.22%), IT 서비스(+5.3%), 금융(+2.12%), 음식료/담배(+1.73%), 운송/창고(+1.65%) 이 강세를 보인 가운데, 종이/목재(-1.3%), 금속(-1.3%), 비금속(-1.3%), KOSPI(-0.77%), 제약(-0.5%)은 부진한 흐름 한편, 외인(-1조 1,1679억원)은 금융(+1,507억원), IT 서비스(+1,474억원), 화학(+243억원), 보험(+237억원) 순으로 순매수, 기관(+2,859억원)은 전기/전자(+1,902억원), 제조(+1,609억원), IT서비스(+1,110억원)순으로 순매수.',
      '▶지난주 동향: S&amp;P GSCI, 주간 기준 1.62% 하락\n&nbsp;\n- S&amp;P GSCI 에너지: -2.95% : 국제유가 하락. 트럼프 미 대통령의 캐나다, 멕시코에 대한 25%의 관세 부과 시행을 앞두고 금융시장 내 투자심리 위축된 영향. 또한 주중 미국 원유 재고가 예상보다 크게 늘어난 점도 유가 하락 요인으로 작용\n- S&amp;P GSCI 귀금속: +1.21% : 금은 안전자산 수요 유입되며 상승. 또한 미 연준이 FOMC에서 정책금리 동결을 발표했으나, 이는 시장 예상에 부합하는 결과였던 만큼 금 가격에 미치는 영향도 제한된 것으로 보임\n- S&amp;P GSCI 산업금속: -0.27% : 비철금속 하락. 미국 트럼프 대통령의 관세 정책에 대한 경계감 속 투자심리 위축된 영향. 또한 관련 이슈로 달러가 강세를 보인 점도 비철 가격 하락 요인으로 작용',
      '[01/27 ~ 01/31 Summary]\n&nbsp;\n▶ 코스피, 코스닥의 선행 영업이익 추정치는 각각 -0.73%, -0.57%를 기록 (추정치가 52주 유지된 종목 기준)\n&nbsp;- 강세 업종: 운송(+1.3%), 조선(+0.9%) / 약세 업종: IT가전(-12.1%), 화학(-10.0%) 등\n- 1개월 이익 vs 주가 ±2% 이상 디커플링 업종: IT하드웨어(-)\n▶ 4Q24 실적 시즌 이전 대비 현재까지 발표된 실적은 -17.9%로 부진한 성적을 기록하고 있으며, 이에 따라 전주 이익 추정치 상향 업종은 -0.14%, 하향 업종은 -1.91%를 기록하며 실적 방어 수요가 높아지는 현상 관찰\n▶ 전 주는 실적 기간에도 불구하고 연휴 영향으로 증시와 이익 추정치의 변동량이 크지 않아 Fundamental value/시가총액 비율은 약 1.028에서 1.032수준으로 소폭 상승 조정에 그침. 이전 자료와 마찬가지로 현재 밸류에이션은 부담스럽지 않으나, 추가 상승을 위한 이익 모멘텀이 부재하여 단기적으로 박스권 장세 예상',
      '“2월 1째주 전략” 美 우방국에도 관세 부과. 日 정부도 긴장 중\n&nbsp;\n- 美 트럼프 행정부는 캐나다, 멕시코 등 전통 우방국에게 2.1일부로 관세 부과(25%)에 대한 행정명령에 서명하고 4일부터 발효토록 했다. 이는 7일 이시바 시게루 총리와 트럼프 대통령간 정상회담을 앞두고 있는 일본 정부에게 부담이 되는 상황이다. 미일 정상회담에서 두 정상은 안보(중국, 북한 문제 등)와경제 분야에서 협력 강화가 주요 논의사항이 될 것이다. 하지만 트럼프가 일본에 직접적으로 거론할 수 있는 사항으로 1) 주일 미군에 대한 방위비 증액, 2) 달러 약세를 저지하는 엔화 약세와 관련된 환율정책, 3) 미국산 LNG 수입 확대, 4) 일본제철의 US스틸 인수 문제가 될 공산이 크다.&nbsp;\n- 당장은 트럼프가 일본에 대해 관세 부과에 대한 압박보다는 달러화에 관련된 일본의 현 통화정책에 더 초점을 맞출 것이다. 최근 1월 BOJ 금정위에서 금리 인상 단행, 엔화는 올해(1.9일 이후) 들어 강세 압력이 커지면서 150엔 대 중반으로 내려와 있다. 트럼프가 일본의 환율정책을 두고 현재 환율조작 관찰 대상국에 올라와 있는 일본에 대해 환율조작국 지정과 같은 공세적인 압박을 택하기 보다는, 현 엔화 강세 기조의 바탕이 되고 있는 BOJ 통화정책에 대해 두둔하는 스탠스를 내비칠 가능성이 커 보인다.\n- 이번 미일 정상회담은 BOJ 입장에서 현 통화정책 정상화에 더욱 힘을 실을 수 있는 요인이 될 것이다. 향후 트럼프 관세 정책의 향방에 따라 불확실성은 매우 크지만, BOJ는 예상수순을 밟고 있는 경제와 물가 경로 인식, 기조적 물가 상승률은 물가안정목표와 대체로 부합할 것이라는 인식을 통해 점진적인 금리 인상을 밟아 나갈 것이다. 이는 일본 입장에서 트럼프 불확실성에 대비하는(늦추는) 한가지 방편이 될 것이다. &nbsp;',
      'Summary. DeepSeek Shock, 트럼프 불확실성에 흔들리는 증시. 선수요 유입과 물가 안정이 이끌어 줄 것\n&nbsp;\n- 2월 KOSPI Band 2,450 ~ 2,650p,\n상단 2,650p : 선행 PER 9.46배(24년 이후 평균), 확정실적 기준 PBR 0.936배, 선행 PBR 0.876배(24년 하반기 이후 평균) 하단 2,450p : 선행 PBR 0.8배(8월 5일 종가 기준 저점), 확정실적 기준 PBR 0.85배(8월 5일 장 중 저점), 12개월 선행 PER 8.7배(24년 하반기 이후 평균)\n- KOSPI 6개월만에 상승 반전. 25년 반전의 시작. 1) 미국 경기 정상화/둔화 국면에서 물가 안정, 금리인하 사이클 지속, 2) 중국을 필두로 Non-US 경기 회복, 3) 채권금리, 달러화 하향안정과 함께 4) 한국 수출 호조 지속, 환율 효과 가세하며 기업이익 개선 가시화. 3) 상반기 중 국내 정치적 리스크 완화/해소, 4) 트럼프 정책에 대한 과도한 불안심리의 정상화 등이 KOSPI 기술적 반등을 넘어 추세 반전을 이끌어가는 동력\n- 1) 트럼프 2.0시대 시작과 함께 관세/통상 정책 이슈에 대한 불안심리 정점통과. 시장 우려만큼 정책 시행 속도와 강도가 빠르거나 강하지 않음을 확인 트럼프 대통령의 관세 관련 발언에 따른 등락은 협상을 위한 것. 변동성 확대시 비중확대 기회로 판단 2) DeepSeek 쇼크로 인한 AI, 전력 관련주 변동성 확대는 점차 진정될 전망. 미국 AI 패권 지위 유효, 새로운 전환점 통과, 패러다임 변화 과정에서 불안심리 증폭 AI 반도체 사이클, 성장성 유효. 속도와 모멘텀에 대한 고민은 감안. 한편, 소프트웨어 비용 절감, 효율성 강화에 대한 기대심리도 동시에 유입\n- 글로벌 금융시장이 이슈, 이벤트, 트럼프 워딩에 일희일비할 수록 펀더멘털 변화에 집중 1) 미국 소비/경기, 고용 둔화 속에 물가 안정 재개 예상. 금리인하 기대가 되살아나면서 달러와 채권금리 하향 안정될 것. 위험 선호심리, 아시아 금융시장 안정성 강화 2) 트럼프 관세 우려가 커질수록 선수요 유입이 빨라지고 강해질 것. 글로벌 제조업, 교역 회복/개선 가시화. Non-US 경기 우려가 안도/기대로 전환될 수 있음 3) 중국 양회(3월) 기대 강화. 경제공작회의, 지방 양회를 통해 정책 우선순위 내수 확대로 이동. 경기 회복 가시화되는 상황에서 정책 신뢰도 회복시 중국 모멘텀 유입 4) 국내 정치 리스크 완화 국면. 빠르면 2월말 ~ 3월초 탄핵 결정 예상. 리스크 완화와 동시에 새로운 정권에 대한 기대 유입 가능 5) 연기금 순매수 지속(국내 주식 비중 확대)되는 가운데 국내 정치 리스크 완화/해소, 달러화 안정, 원화 강세 압력 확대시 외국인 수급 개선 가세할 전망 4Q 실적 시즌 동안 실적 불확실성에 따른 등락 불가피. 하지만, 더욱 낮아진 실적 눈높이는 1Q 실적 시즌에서 긍정적인 변화(예상 상회, 서프라이즈 등)를 기대케할 것 1월 KOSPI 기술적 반등은 추세 반전의 시작, 2월 2,600선 돌파에 이어 상반기 KOSPI 상승추세 전개 예상. 대신증권 25년 상반기 KOSPI Target 3,000p로 유지',
      '증시 Comment (전일 아시아 증시)\n▶ 한국증시\n- 연휴 직후 딥시크 여파 반영하며 하락. 미국 증시에 기반영 되었던 딥시크 출현에 대한 충격 나타나면서 반도체주 중심 외국인 매도 물량 출회. 다만, AI 개발 비용효율화 기대감 반영 되면서 인터넷/소프트웨어 업종은 상승. 전 거래일 대비 0.77% 하락한 2,517.37P로 마감\n- KOSDAQ은 반도체 업종 부진에도 소프트웨어 업종 강세에 약보합 마감. 전 거래일 대비 0.06% 하락한 728.29P로 마감\n▶ 중국증시\n- 춘절 연휴로 휴장(~2/4)',
      '‘2월 효과’에 더해진 딥시크 파급력. 악재보다 호재에 민감한 국면\n&nbsp;\n글로벌 주식시장에서 ‘1월 효과’가 널리 통용되는 것과 달리 중국은 ‘2월 효과’가 뚜렷하다. 3월 초 양회를 앞두고 지방정부와 중앙부처 목표가 발표되며 부양책 기대감이 극대화되는 구간이기 때문이다. 더군다나 2월은 경제지표 공백기다. 주식시장은 철저하게 정책 기대감을 따라간다. 통계적으로도 2월의 승리 확률이 가장 높다. 지난 2020년 이후 19번이나 (+)수익률을 기록했다. 79.2%의 승률이다. 중국 주식시장 측면에서 딥시크의 부상은 위험선호심리 개선으로 이어질 전망이다. 미국의 기술규제를 돌파한 상징적 의미가 크고 정부주도 AI 정책 지원이 실제 성과로 이어졌기 때문이다. 수급 측면에서 기술주 쏠림이 예상되는 가운데 IT 하드웨어 뿐 아니라 IT소프트웨어(응용, 플랫폼)까지 온기가 확산될 전망이다.',
      '트럼프 2기, 1기와는 정책 순서가 다를 듯\n&nbsp;\n당장 대규모 감세를 추진하기에는 정치적/경제적 부담 남아 있어\n- 미국 하원에서 공화당이 우위임. 그러나 격차는 3석에 그침. 지난 100년래 최소 폭임.\n- 합의를 우선적으로 생각하는 미국 의회 문화를 감안하면 감세 등 트럼프 공약이 현실화되는데 시간이 걸릴 가능성이 높음.\n- 게다가, 트럼프 1기 초기 미국 재정적자는 GDP 대비 3.1%대였음. 현재 GDP 대비 7.4%임. 재정확대에 부담이 있음.\n- 트럼프 2기에는 1기와는 달리 감세보다 관세와 이민 이슈가 먼저 등장할 수밖에 없음.',
      '어닝 모델 상위 12%: DeepSeek 이슈로 P/B 1.5배 밸류 바닥 확인 유력 ▶ 12M F. EPS 기간별 변화율\n&nbsp;\n- 동사 주가는 코로나 이후 장기 하락 추세를 이어오며 P/B 1.5배까지 하락\n- 단, P/B 1.5배 부근이 여러 차례 바닥을 확인했던 밸류 수준임을 주시할 필요\n- 업황 및 실적 개선 기대 높지 않으나, 12M F. EPS 상향 전환 조짐 긍정적\n- 내수 지표들 부진하나, 대체로 바닥권에 있어 하반기 내수 개선 기대감 유효\n- 특히, 1월 말 DeepSeek 부각에 따른 AI 대중화 기대감 확대로 소프트웨어 업황 개선 기대감 높아지며 밸류 바닥 확인의 촉매제로 작용할 전망\n- DeepSeek 부각 후, 미 증시에서 엔비디아 하락, 메타 상승 기조 뚜렷\n- 경쟁사 NAVER와의 10개월 주가 상대 수익률도 -44%p까지 하락하며 과도하게 주가 갭이 확대되어 있음을 주시할 필요',
      '[자산배분] 안정과 위험의 균형을 강조\n&nbsp;\n트럼프발 정책 불확실성은 해소보다 이연(移延)에 무게감을 둬야 한다. 중국, 멕시코 중심 관세정책은 근시일 내 발표될 예정이고 정책시즌에 진입한 중국은 수용보다 맞대응 전략을 강구하고 있다. 주식, 채권 공히 상하방이 예상되고 특정자산 선호보다 위험과 안전의 균형이 강조돼야 할 시점이다. 주식 비중 확대를 이어가야 한다. 미국과 중국 비중 확대를 유지하고 가격 매력 부각된 한국 비중을 상향했다. 채권은 중립 의견을 유지하나 점진적 듀레이션 확대가 필요하다. 대체에서는 중국발 정책 모멘텀에서 산업금속 비중 확대 전략을 유지한다.\n&nbsp;',
      '1월 수출, 조업일수가 줄어들면서 감소 전환\n1월 한국 수출은 491.2억 달러로 전년동월대비 10.3% 감소, 수입은 510.0억 달러로 6.4% 감소. 설 연휴로 조업일수가 지난해 1월보다 4일 줄어든 영향. 일평균 수출은 24.6억 달러로 전년동월대비 7.7% 증가. 반도체와 선박 제외 일평균 수출(+2.3%)은 4개월만에 증가 전환 15대 품목 중 자동차/부품, 기계, 석유제품, 가전을 제외한 10개 품목의 일평균 수출은 전년동월대비 증가. 철강, 석유제품, 석유화학, 선박 일평균 수출은 직전 3개월 평균 대비 증가. 반도체, 디스플레이, 2차전지 등은 감소. 지역별로 보면, 대인도, 일본 수출 양호한 반면, 대미국 및 중국 수출 둔화 수출단가는 전년동월대비 2.4% 상승, 수출물량은 12.4% 감소. 지난달과 비교하면 단가와 일평균 물량 모두 부진. 무역수지는 수입 대비 수출 감소세가 커지면서 적자 전환(-18.9억 달러)&nbsp;',
      '미국 트럼프 발언과 노동시장 흐름에 주목\n&nbsp;\n이번 주에는 트럼프 관세 부과에 따른 주요 가격변수들의 영향과 미국 노동시장 관련 지표들의 흐름에 주목할 필요가 있다. 트럼프 대통령의 관세 부과 방침에 따라 관련 발언에 따라 당분간 금융시장의 변동성이 확대될 수 있다. 하지만, 트럼프 대통령의 물가 안정에 대한 입장을 고려한다면 급진적인 관세 부과도 제한될 수 있어 금융시장의 급격한 위축 가능성도 낮아 보인다. 이번 주 미국에서는 구인건수와 고용보고서가 발표될 예정이다. 시장 컨센서스는 고용은 전월보다 둔화될 것으로 보이나 실업률은 전월 수준을 유지할 것으로 보인다. 미국 노동시장이 점진적이지만 둔화세를 보인다면 트럼프 관세 부과 뉴스는 점차 성장 둔화에 대한 우려를 높이는 쪽으로 반영될 것으로 예상한다.',
      'Comment\n- 31일(금) 증시는 중국 인공지능(AI) 스타트업 딥시크 충격을 뒤늦게 반영하며 2,510대로 밀린 채 마감(KOSPI -0.77%, KOSDAQ -0.06%). 딥시크 충격과 1월 미 연방공개시장위원회(FOMC)의 기준금리 동결 등 악재를 한번에 반영하며 하락세가 강해진 영향. 고성능 반도체와 대규모 데이터센터·전력설비 투자 모멘텀의 둔화 우려로 반도체, 전력기기 업종의 주가 변동성이 확대. SK하이닉스(-9.86%), 삼성전자(-2.42%), 한미반도체(-6.14%), HD현대일렉트릭(-7.87%) 등 반도체주와 전력설비주 동반 하락. 반면 NAVER(6.13%), 카카오(7.27%), 삼성에스디에스(6.16%) 등 딥시크 수혜주로 부각된 소프트웨어 종목은 강세. 기업가치 제고 계획을 밝힌 삼성화재(11.71%)를 포함한 삼성생명(9.73%), KB금융(3.15%), 메리츠금융지주(4.48%) 등 금융주 전반이 상승.',
      '1월 국내 수출 전년동월대비 10.3% 감소\n&nbsp;\n1월 국내수출이 전년동월대비 10.3% 감소했다. 수입 역시 한달만에 전년동월대비 6.4% 감소, 무역수지는 16개월만에 적자 전환되었다. 다소 부진한 모습이지만, 조업 일수 4일 감소(설 연휴) 영향이 컸으며, 시장 예상에는 부합하는 수준이다. 조업일수 감소에도 주요수출품목 중 반도체, 컴퓨터는 증가세를 유지한 반면, 대부분의 품목들은 감소했다. 주요수출품목 중 석유제품, 자동차/자동차부품 등은 조업 일수를 감안하더라도 감소 폭이 컸다. 미국의 관세 부과를 앞두고 밀어내기 수출이 지속되고 있고, 조업일수 영향을 감안하면 수출은 2월 다시 회복이 기대된다. 하지만 시장 예상보다 빠르게 관세 위협이 시작됐다는 점에서, 수출 개선세가 빠르게 마무리될 수 있어 경계가 필요하다.',
      '트럼프, 보편관세 서명…대상국 보복조치 예고\n&nbsp;\n현지시간 1일 트럼프 대통령은 캐나다, 멕시코, 중국에 대한 관세를 부과하는 행정명령에 서명했다. 4 일부터 캐나다 에너지 제품에 10%, 그 외 모든 제품에 25%, 멕시코는 에너지류를 포함한 모든 제품에 25%, 중국에는 보편관세 10%가 시행된다. 보편관세 부과의 이유는 기존에 경고했던 대로 펜타닐 등 마약 유입 및 불법 이민자 문제라고 밝혔다. 본 행정명령에는 상대국이 미국에 보복조치를 하는 경우 관세율을 추가로 올리거나 제품의 범위를 확대하는 보복 조항이 포함되어 있다. 추가로 EU 에 대해서는 반도체, 철강, 석유, 가스 등 부문별 추가 관세 부과를 예고했으며 석유 및 가스는 2 월 18 일 관세 부과를 예고했다. 트럼프 1기 행정부가 시행했던 첫 관세 부과가 철(25%), 알루미늄(10%) 및 특정 산업들(자동차, 첨단기술 등)에 집중됐던 것과 달리 이번 관세는 보편관세로 모든 품목에 일괄 적용하는 방식이 특징이다. 캐나다, 멕시코, 중국은 보복조치를 예고했다. 캐나다 총리는 긴급 기자회견을 통해 1,550 억 캐나다달러 상당의 미국산 제품에 25% 관세를 발표했고, 캐나다 일부 주에서는 미국산 주류 판매 중단 및 미국산 차의 통행료 2 배 부과 등을 언급했다. 멕시코 역시 보복관세를 예고했으며 중국은 담화문을 통해 WTO 제소를 예고했다.',
      '2025 년 무난한 출발\n&nbsp;\n한국 수출이 2025 년 첫 출발을 무난하게 시작했다. 1 월 한국 수출은 -10.3%YoY 를 기록했다. 설 연휴 영향에 월간 수출은 급감했지만 일평균 수출 증가율은 +7.7%YoY 로 지난해 9 월 이후 최고치를 기록했다. 무역수지는 계절적 요인으로 20 개월 만에 처음으로 적자를 기록했다. 품목별로는 주요 품목 중 컴퓨터(+14.8%), 반도체(+8.1%)를 제외한 나머지 품목들이 감소했지만, 일평균 기준으로는 15 대 품목 중 10 개 품목이 증가했다. 국가별로도 일평균 기준으로는 중동을 제외한 8 개 시장에서 모두 증가했다. 계절적 요인을 고려하더라도 일평균 수출액이 전월비 -1.6 억달러 가까이 감소한 것이 다소 불안한 요인이기는 하다. 하지만 지난해 12 월 수출이 미국의 대중 제재 등을 앞두고 연말 밀어내기 영향이 컸다는 인식이 많았는데 이러한 우려를 어느 정도는 해소했다고 볼 수 있다. IT 수출도 여전히 양호하게 유지되고 있다. 글로벌 제조업 경기나 한국의 수출 경기가 썩 좋지 않은 것은 사실이나, 지난달 수출 코멘트에서 언급했듯 그래도 과거 둔화 국면에 비해서는 선방 중이다. 수출경기확산지수를 보더라도 아직 하락세가 더 뚜렷해지지는 않고 있다. 결국 미국의 통상정책이 가장 중요하다.',
      '1월 수출 YoY 10.3%, 수입 6.4% 감소. 무역적자 전환\n&nbsp;\n1월 수출은 전년동월대비 10.3% 줄며 16개월 만에 감소 전환됐다. 설연휴 이동과 임시공휴일 지정으로 조업일수가 4일 줄어든 점을 고려한 일평균수출은 7.7% 늘어 3개월 연속 개선됐다. 수입은 에너지를 중심으로 줄며 6.4% 감소 반전됐고, 무역수지도 20개월 만에 19억달러 적자를 기록했다.',
      '현실화된 관세 리스크로 안전자산 선호 현상이 일부 강화\n&nbsp;\n중국발 딥시크 충격이 체 가시지 않은 상황에서 우려했던 트럼프 관세 리스크가 현실화되었다. 트럼프 대통령은 2월 4일 캐나다 및 멕시코에 대한 25% 관세와 더불어 중국산 제품에 대한 10% 관세 부과를 강행하기로 했다. 무엇보다 트럼프 대통령이 관세정책이 협상용이 아니라는 점을 분명히 하면서 관세정책 지연 혹은 완화될 수도 있지 않을까 하는 시장 기대감에 찬물을 끼얹으면서 글로벌 경제와 금융시장이 관세 리스크 폭풍 속으로 마침내 들어가는 분위기다. 현재까지 트럼프 대통령이 밝힌 주요 관세 정책은 다음과 같다.\n1) 2월 4일부로 캐나다 및 멕시코에 대한 25% 관세 및 중국 10% 관세 부과\n2) 석유 및 가스 관세 부과는 2월 18일부터 시작. 단 석유에 대해서는 10% 관세 부과\n3) 철강, 알루미늄, 의약품 및 반도체 등에 대해서도 관세 부과 예정',
      '주간 동향: 캐나다 및 멕시코 관세 부과로 달러는 다시 제자리\n&nbsp;\n- 1월 FOMC 회의는 무난히 넘겼지만 트럼프 대통령이 2월 1일부로 캐나다와 멕시코에 대해 25% 관세 부과를 강행하면서 달러화가 강세 전환됨. 물가 및 국채 리스크 진정으로 안정을 찾던 달러화가 관세 리스크로 변동성이 확대됨\n- 유로화는 1%를 상회하는 하락폭을 기록함. 부진한 유로존 4분기 GDP성장률과 ECB의 추가 금리인하가 유로화 약세 재료로 작용한 가운데 트럼프 관세 리스크는 유로화 약세 폭을 확대시킴\n- 엔화 가치는 소폭 상승함. 다만, 일본은행의 추가 금리인상 여진으로 154엔까지 하락했던 달러-엔 환율은 관세 리스크로 다시 155엔대로 상승하는 등 엔 강세폭이 축소됨\n- 역외 달러-위안 환율도 상승함. 춘제 연휴로 중국 금융시장이 휴장했지만 역외 위안화 환율은 중국산 제품에 대한 10% 관세 부과가 현실화되면서 한주동안 상승세를 이어감\n- 호주달러도 달러 강세와 2월 호주 중앙은행의 금리인하 기대감을 반영하면서 큰 폭으로 하락함\n- 달러-원 환율은 다시 1,450원대로 반등함. 중국발 딥시크 충격에 외국인의 주식 순매도 급증, 트럼프 관세 리스크 현실화 등으로 달러-원 환율이 급등함',
      '정책 불확실성 속 관망 입장 유지한 미 연준\n&nbsp;\n- 트럼프 취임 이후 행정명령 공개가 잇따른 가운데 FOMC 회의, ECB 통화정책 회의 등 선진국 통화정책회의 소화. 중국 1월 PMI와 미국과 유로존 4Q GDP 속보치 발표 등 경제지표 발표 있었으나 영향력 제한\n- 1월 FOMC 회의에서 연준 기준금리 만장일치 동결. 성명서 문구 변화 통해 고용경기 인식 상향 속 인플레이션 경계 강화. 파월 의장 기자회견에서 비둘기파적 발언에도 현재 경제 상황 고려 시 정책 변경 서두를 필요 없다고 언급하며 3월 인하 기대 하향. 정책 불확실성에 대해 유보적 태도 견지. 경제 및 금융환경의 급격한 변화 부재 시 금리 동결 기조 유지 무게\n- 미국 4분기 GDP 전기대비연율 2.3% 성장하며 컨센서스(+2.6%) 하회. 다만 재고 소진에 따른 성장기여도 감소(-0.9%p) 영향이며 이를 감안 시 양호. 유로존 4분기 GDP 전기대비 보합 기록해 부진한 성장세 지속. ECB 물가 반등에도 경기 하방 위험에 기준금리 25bp 인하. 추가 인하 통한 정책 대응 시사\n- 중국 1월 국가통계국 제조업과 비제조업 PMI 후퇴. 미국 1월 소비자신뢰지수 하락. 연말 쇼핑시즌 수요 유입 단기에 집중된 데 따른 기저효과. 중국 정책 대응 필요성 강화된 가운데 미국도 수요 완만한 둔화 속 물가 재상승 제한 시사',
      '미국-비미국 정책 차별화 완화 기대 속 달러화 박스권\n&nbsp;\n- 달러화 108pt 내외 박스권 등락. 미국과 비미국 간 통화정책 차별화 완화 기대 점증. 미국 주요지표 대체로 예상치 소폭 하회한 가운데 1월 FOMC 회의 연준 중립적 태도 견지. 성명서 문구 상 경기 및&nbsp;\n물가 판단 상향됐으나 기자회견에서 하방에 대한 대응 의지도 표명. 1월 ECB 통화정책회의에서 정책금리 25bp 인하 결정. 다만 점진적인 경기 회복 전망에 유럽경제에 대한 극단적인 비관 완화되는 양상\n- 달러/유로 1.04달러 내외로 상승. 유럽경제에 대한 비관론 완화 영향. 엔/달러 154엔대로 하락. 1월 BOJ 통화정책회의에서 정책금리 인상하면서 미국과 일본 간 통화정책 차별화 축소 기대 반영\n- 원/달러 1,450원대로 연휴 이후 반등. 딥시크발 금융시장 변동성 확대 여파로 주식시장에서 외국인과 내국인 동반 자금 이탈된 영향&nbsp;',
      '1 월 제조업 PMI 하락\n&nbsp;\n1 월 중국 제조업 PMI 가 49.1pt 로 전월대비 큰 폭 하락했다. 춘절 연휴와 더불어 트럼프 리스크 확대에 따른 영향이다. 세부 지표를 살펴보면, 생산 지수가 12 월의 52.1pt 에서 1 월 49.8pt 로, 신규주문 지수가 12 월의 51pt 에서 1 월 49.2pt 로, 신규수출주문 지수는 12 월의 48.3pt 에서 1 월 46.4pt 로 모두 경기위축국면에 진입했다. 생산 지수는 춘절 연휴가 있는 달의 경우 생산 감소로 인해 하락하는 경향이 있다. 그러나 수요 지수의 경우 춘절 연휴를 앞두고 있었음에도 불구하고 11 개월만에 최저 수준을 기록했는데, 이는 1) 트럼프 2 기 행정부 취임에 따른 불확실성 확대, 2)트럼프 취임 전 수출 밀어내기에 따른 수요 감소, 3) 1/20 부터 적용되기 시작한 이구환신 확대 정책에 의한 것으로 보여진다. 다행히 트럼프 취임 이후 대중 관세 인상 정책은 취임 이전 강력하게 강조했던 것과는 달리 급진적으로 진행되고 있지 않다. 트럼프 대통령과 시진핑 국가주석은 갈등 해소를 위한 소통 강화를 약속했다. 급진적이지 않더라도 트럼프는 대중 관세를 협상의 도구로 활용할 계획이다. 앞으로 중국 수출 리스크는 여전히 크며 내수 회복은 여전히 불안하다. 한편 미중 관계는 무역 뿐만 아니라 기술 측면에서의 갈등도 더 심화될 전망이다. 중국은행이 23 일 AI 산업 발전을 지원하기 위한 실행 계획&gt;을 발표하며 AI 산업 육성에 대한 의지를 드러낸 가운데 중국의 AI 스타트업 DeepSeek 가 개발한 R1 이 저렴한 비용(약 $600 만)과 저 사양(H800)의 반도체로 open AI 의 o1에 준하는 성능을 보였기 때문이다. 그동안 미국의 견제에도 불구하고 중국이 첨단 산업에서 괄목할 만한 성과를 내놓으면서 그동안 소외되었던 중국 증시로의 관심도 이어지고 있다. 중국 증시는 1/28부터 2/4까지 휴장이지만 나스닥 차이나 골든 드래곤 지수는 28~30일 +5% 상승했다. 단기적으로 중국 특히 DeepSeek 관련주에 대한 관심이 지속될 것으로 예상된다. 그러나 아직 중국 내수 부진에 대한 부담이 존재한다는 점, 미국과의 갈등이 지속될 예정이라는 점에서 추세적인 반등은 시간이 더 필요할 것으로 전망한다.',
      '양호한 경기, 더딘 물가 안정 속 연속 금리 인하 중단\n1월 28일~29일 미국 연방공개시장위원회(Federal Open Market Committee)에서 연방기금 목표금리를 4.25~4.50%로 만장일치 동결 결정했다. 기준금리 하단 및 상단으로 작용하는 역레포 금리와 초과지준부리 역시 4.25%, 4.40%로 동일하게 유지했다. 지난 12월 회의에서 향후 금리 인하에 대한 신중함과 함께 금리 전망 점도표 및 기자회견을 통해 인하 속도 조절을 예고한 것을 그대로 따랐다. 연말 연초 발표된 경제지표에서도 양호한 경기 흐름 속에 더딘 물가 안정이 나타난 만큼 연준 가이던스에 부합한 정책 결정이었다. 성명서 문구에서 크게 두 가지 부분이 바꼈다. 1) “인플레이션이 연준의 2% 목표를 향해 진전을 보였지만 여전히 다소 높은 수준”이라는 문구에서 “연준의 2% 목표를 향해 진전을 보였지만”이라는 문구가 삭제됐다. 인플레이션 재상승 또는 정체 위험을 기존보다 높게 보고 있음을 시사한다. 2) 고용시장 판단은 상향됐다. 12월 성명서에서 “올해 초 이후 고용시장이 전반적으로 완화됐고 실업률이 상승했지만 여전히 낮은 수준”이라는 표현이 “최근 실업률이 낮은 수준에서 안정됐고 고용시장 여건이 견고하게 유지되고 있다”고 평가했다. 고용시장이 완화됐다는 평가가 삭제되면서 고용시장의 하방 위험이 기존보다 약해졌음을 드러내고 있다.',
      '이차전지 외면하는 채권시장…LG엔솔 물량 부담 주시\n- 업황과 실적 부진의 이중고에 휩싸인 이차전지 업체들이 조달 부담을 피하지 못하고 있음\n- 투자 자금 소요가 여전하지만, 채권시장에서의 자금 마련은 녹록지 않은 분위기\n- LG에너지솔루션(AA,S)는 내달 6일 최대 1조5천억원에서 2조원 규모의 채권 발행을 위한 수요예측에 나설 예정이며, SK온(A+,S)도 채권 발행 가능성을 살피는 중',
      '중립금리에 대한 이견이 좁혀지는 중\nFOMC와 그 이후 연준의 동향을 보면 미세하지만 중요한 변화가 한 가지 존재. 내부 이견이 좁혀지는 모습. 내부 이견은 중립금리와 정책 조정 속도에 대한 견해를 의미. ‘상승 vs. 유지’에서 ‘상당히 상승 vs. 약간 상승’으로 바뀐 중립금리에 대한 의견이 이제는 ‘어느정도 상승’으로 모아지고 있음 최근 중립금리에 대한 견해는 크게 두 가지. Powell 의장을 포함한 대다수 인사들은 현재 기준금리가 중립금리를 어느정도(somewhat) 상회한다고 했고, Goolsbee 총재 등 일부 온건한 성향의 사람들은 중립금리보다 기준금리가 상당히(meaningfully) 높은 곳에 위치한다고 추정 중립금리 상승 여부에 신중했던 Powell 의장은 FOMC 기자회견에서 기준 금리가 중립금리보다 상당히(meaningfully) 위에 있다고 언급. 다음 날 Goolsbee 총재는 중립금리는 기준금리보다 어느정도(a fair bit low) 밑에 있다는 의견 제시. 보수적이었던 이들은 조금 전향적으로, 전향적이었던 이들은 신중해진 모습. 중립금리는 기준금리의 최종 목적지. 이 목적지를 두고 서로의 이견이 좁혀지고 있는 것',
      '연준, 금리인하 ‘일시정지(pause)’. 트럼프는 어려워\n시장에서는 연내 연준의 2회 기준금리 인하 가능성을 가장 높게 반영하고 있지만, 당사는 여전히 연내 100bp 정도 수준의 기준금리 인하 가능성은 유효하다고 판단. 다만, 1월 FOMC로 결과로 연준의 금리인하 재개 시점이 다소 늦춰질 수 있다는 점은 인정. 연준의 통화정책이 금리인하 사이클 시작 전보다 덜 제약적이기는 하지만, 아직은 추가적인 금리인하의 필요. 1월 FOMC에서 연준이 금리인하 “일시정지(pause)” 버튼을 누른 배경이 미국의 양호한 경제상황 보다는 트럼프 2기 행정부의 정책 불확실성 때문이라고 판단',
      '전일 국내 채권 시장 요약\n- 금리방향: 상승(3Y), 하락(10Y)\n- 일드커브: 플래트닝\n- 스프레드(bp): 국5/3 13.2 (-0.8) 국10/3: 28.7 (-1.5) 국 10/5: 15.5 (-0.7) 국30/10: -11.0 (1.0)',
      '지난주 동향\n지난주 채권 시장은 설 연휴로 변동성이 제한된 가운데 미국채 시장은 강세 압력을 받았다. 주 초반부터 강세를 보였던 미국채금리는 10 년물 기준 8.3bp 하락한 4.539%에 거래를 마감해 4.6% 레벨을 하회했다. 국내 시장은 설 연휴로 31 일 금요일만 개장했다. 연휴 사이 미국채 금리 하락에 따라 강세 출발 이후 추가 강세 압력이 제한되었다. 달러/원 환율이 상승한데다 2 월 국고채 발행 물량 부담 등이 약세 전환시킨 것이다. 국고 30 년물 입찰을 앞두고 헤지수요 등이 시장 약세를 주도했다. 한편 미국채 금리는 주 초반부터 하락 압력을 받았다. 주 초반 딥시크(DeepSeek) 발 AI 관련 우려가 금융시장 변동성을 확대시키면서 위험회피 성향이 강화된 것이었다. 미국채 10 년물 금리는 4.6%를 하회하고 4.5% 수준에서 거래되는 등 그간의 가파른 상승세를 되돌리는 양상을 보였다. 설 연휴 기간 미 연준 FOMC 도 개최되었고, 예상과 같이 1 월에는 동결 결정을 내렸다. 물가 둔화 흐름을 좀더 확인할 필요가 있다는 관점에서 여전히 매파적인 성향을 취했으나, 예상보다 매파적이지는 않았다는 점에 미국채 금리는 큰 변화를 보이지 않았다. 향후 트럼프 행정부의 정책을 좀더 확인해야 하는만큼 시장 또한 이를 대기하는 양상이었다. 그 가운데 1 분기 GDP 성장률은 예상보다 둔화된 것으로 발표되면서 이 또한 금리 하락 요인으로 작용했으며, 12 월 PCE 물가는 예상에 부합했으나 11 월보다 상승세가 가팔라졌다는 인식에 장중 변동성이 확대되기도 했다. 한편 주 후반 들어 트럼프 관세 정책이 수면 위로 오르면서 시장금리 하락폭을 제한시켰다. 트럼프 행정부는 2 월 1 일부터 중국, 멕시코, 캐나다에 관세 부과를 시작하겠다고 발표했으며, 이로 인해 물가 상승 압력 우려 등이 부각되면서 금리는 낙폭을 축소했다.',
      '국내 채권시장 동향\n- 국내 채권시장 약세 마감\n- 설 연휴 사이 딥시크 쇼크 등으로 짙어진 글로벌 위험 회피 심리 속 강세 출발. 전일 미 4Q24 GDP, 예상 및 이전치 밑돈 점도 영향\n- 이후 점차 강세폭 축소하기 시작. 초장기물 입찰 앞둔 경계, 원-달러 환율 급등, 아시아장 중 상승한 미국채 금리 여파 반영\n- 트럼프 관세 위협도 부각. 트럼프. 브릭스 국가가 새로운 통화를 만들거나 달러를 대체하려는 시도 보일 시 관세 100% 부과할 것이라 경고',
      '미국: 국채 10년 4.55% 이상 시 저가 매수 기회 활용\n지난해 12월 이후 미국 국채 10년 상승은 기간프리미엄 확대가 주도했다. 대선 전후로 국채 공급 확대, 물가 및 금리 전망 불확실성 증대가 부각된 여파다. 통화완화 기대 역시 상당부분 후퇴했다. 2월부터 트럼프 정부의 관세 정책이 본격화된다. 트럼프의 주요 정책 시행과 그에 따른 효과를 아직 가늠하기 어렵기 때문에 미국 금리 하락 기대가 크지 않은 것이 현실이다. 전기대비 연율 2% 이상 기록하는 성장세도 장기 금리 하락을 제한한다. 그럼에도 미국 국채 10년 기준 4.55%, 2/10년 스프레드 30bp 이상 구간은 장기물 저가 매수 기회로 판단한다. 기준금리 인하가 멈췄고, 당장 국채 공급 확대가 예상되지 않는다. 추가 수익률 곡선 정상화보다는 플랫 전환 기대가 형성되는 이유다. 기준금리 동결 속 미국 국채 2년 금리는 4.00~4.25% 내 제한적 움직임을 보일 가능성이 높다. 2/10년 스프레드 30bp 이상을 과도한 수준이라 볼 때 미국 국채 10년이 4.55% 이상을 저가 매수 기회로 활용할 구간으로 제시한다.',
      '1월 ECB 통화정책회의, 주요 정책금리 25bp 인하 단행\nECB가 1월 통화정책회의에서 기준금리(예금금리)를 2.75%로 25bp 인하했다. Refi금리와 대출금리도 2.90%, 3.15%로 각각 25bp 인하됐다. PEPP(pandemic emergency purchase programme)는 지난 회의에서 예고한대로 만기 도래분 전액 재투자가 중단되며 기존 월 75억유로에서 축소 속도가 가속화되었다. 금번 회의 전반에서 ECB의 디스인플레이션 달성 기대감이 두드러졌다. 성명문에서는 서비스 물가 하방경직성을 견인하던 임금상승률이 둔화되고 있다는 문구가 추가되었다. 최근 헤드라인 인플레이션이 2.2%에서 2.4%로 반등한 점에 대해서는 에너지 가격 하락의 기저효과가 제거된 영향이라는 설명을 덧붙였다. ECB는 향후 인플레이션이 현재 수준에서 변동 후 2%에 안착할 것으로 전망했다. Q&amp;A에서는 인하 사이클 종착지와 중립금리 관련 질의가 반복해서 등장했다. 총재는 현재 유로존 기준금리가 아직 제약적 수준임을 강조하면서 금리 인하 중단 시점 논의는 시기상조라고 평가했다. 기준금리가 중립 수준에 가까워지면 중립금리 레벨 논의와 함께 향후 통화정책 방향 결정할 것을 시사했다.',
      '■ 주요 뉴스: 캐나다•멕시코•중국, 미국의 관세 부과에 무역 보복 예고. 단기 충격 불가피 전망\n\r\n   ○ 미국 1월 고용보고서 발표, 고용 둔화 예상. 기존 금리 경로 전망은 지속될 가능성  \n\r\n   ○ 연준 주요 인사, 향후 금리인하가 적절. 추가적인 인플레이션 완화도 필요    \n\r\n   ○ 러시아와 인도, BRICS의 독자적인 통화 출범 계획은 부재\n\r\n   \n\r\n■ 국제금융시장(주간): 미국은 트럼프 관세 정책 및 1월 FOMC 결과 등이 영향\n\r\n                      주가 하락[-1.0%], 달러화 강세[+0.9%], 금리 하락[-8bp] \n\r\n   ○ 주가: 미국 S&P500지수는 딥시크 충격, 트럼프 관세 경계감 등으로 하락\n\r\n            유로 Stoxx600지수는 ECB 금리인하 및 양호한 기업실적 등으로 1.8% 상승\n\r\n   ○ 환율: 달러화지수는 트럼프 관세 부과 발표에 따른 관련 영향 등을 반영\n\r\n            유로화 가치는 1.3% 하락, 엔화 가치는 0.5% 상승\n\r\n   ○ 금리: 미국 10년물 국채금리는 안전자산 선호 강화 등으로 하락\n\r\n            독일은 ECB 금리인하 및 디스인플레이션 진전 등으로 11bp 하락\n\r\n       ※ 원/달러 환율(주간) 1.5% 상승, 한국 CDS 하락',
      'ㅁ [딥시크 충격] AI 기술발전의 전환이란 의견과 조심스런 의견 병존. 미중 대결 확대 우려\n\r\n\n\r\nㅁ [미국 경제] 대체로 견조한 성장 지속 평가. 금년 한해는 양호한 성장과 둔화 의견 병존\n\r\n\n\r\nㅁ [트럼프 관세] 관세부과가 종국에는 미국 경제에 부담으로 작용할 것이라는 의견 다수',
      'ㅁ 미국 1월 고용지표 및 ISM 지수에 주목. 연은 총재들의 발언도 관심 \n\r\nㅁ 트럼프의 캐나다, 멕시코, 중국 관세 부과 이후 금융시장 영향에 촉각\n\r\nㅁ 영란은행 금리인하 재개 전망. 인도중앙은행은 첫 금리인하 가능성\n\r\nㅁ 미국 주요기업 실적 발표 및 유로존 1월 CPI에 관심\n\r\nㅁ OPEC+ 회의 개최. 감산 연장과 시행 사이에서 고민\n\r\nㅁ 중국 1월 제조업지수 및 물가지수 발표',
    ];

    const prompt = ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{ECONOMIC_INFORMATION}}',
      JSON.stringify(infos),
    );

    const response = await ollamaService.invoke({ prompt });
    console.log(response);
  });
});
