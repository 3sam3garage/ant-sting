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
      'Top down\n글로벌 자산전략\nTrump Scenario\n글로벌 주식전략\n관세가 주가 하락의 본질이 아니기 때문에 쓸 수 있는 전략\n중국 경제지표\n연초 경기 선방했으나 대내외 불확실성 잔존\nBottom up\n산업 분석\n엔터/미디어/광고 (비중확대) 세 가지 BIG CYCLE\n하이브 (352820/매수) 2026년까지 BIG CYCLE\nJYP Ent. (035900/매수) 확실한 (+)와 모호한 (-) 공존\n에스엠 (041510/매수) 아시아 포지셔닝 확대\n와이지엔터테인먼트 (122870/매수) 적지만 강한 IP 파이프라인\n디어유 (376300/매수) 감시 예상이 어렵다는 것이 포인트\n스튜디오드래곤 (253450/매수) 중국 베타가 가장 큰 업체\nCJ ENM (035760/매수) 기반영된 악재 vs. 멀티플 상향 요소\nSBS (034120/매수) 아직은 멀티플만, 실적은 반영 전\n콘텐트리중앙 (036420/매수) 영끌\n나스미디어 (089600/매수) 광고 판도 변화에서의 최적 FIT 종목\nIT부품/전기전자 (비중확대) 소켓 삼총사, 매력적인 성장 스토리\n신한 속보\n엔비디아GTC 2025 한눈에 보기\n기업 분석\n알테오젠 (196170/매수) 알테오젠; 아스트라제네카로 새로운 국면',
      '주요 뉴스\n- Summary: 소매판매 안도에 스태그플레이션 우려 완화. 광범위한 반등 지속. S&amp;P 500 +0.6%\n- 상해는 연중 최고치: 2월 경제지표 대체로 컨센서스 상회. 소비 진작책 공개 → 소비주 중심 상해증시 강세\n- 2월 미국 소매판매: 1월 증가율 -0.9%에서 -1.2% 하향. 2월 수치도 0.2%로 시장 예상치(0.6%) 하회\n- 다만 안도감: 자동차/휘발유 제외하면 나쁘지 않았던 내용. 근원 소매판매는 전월대비 1.0% 증가하며 안도\n- 갈팡질팡 후 상승: 상승 출발 → 장중 매도세 출현에 하락 전환 → 장 막판 광범위한 매수세 유입 상승 전환\n- 신고가 종목들: 알리바바 신고가 경신. 독일/스페인/이탈리아/일본 은행 ADR 일제 신고가. 거래소들 신고가\n- 래거드의 반등: 반도체주 반등은 인텔, AMD가 주도. 그린 에너지 종목(인페이즈, 징코, 앨버말)들 다수 상승\n- 차별화: 머스크에 대한 반감 미국 전역으로 확대되며 테슬라 -4.8%. 레딧 매도 보고서 등장에 -2%',
      '국내 증시 Comment\n반도체 &amp; 방산 중심 상승마감: 코스피는 지난주 미 정부 셧다운 리스크 해소에 따른 글로벌 증시 급등 영향으로 상승 출발. 특히 금주 진행되는 엔비디아 GTC 기대감 속 반도체 업종 강세 뚜렷. 독일 재정지출 확대 기대감 이어지며 유럽 방위비 모멘텀 속 한국항공우주(+10.9%), 한화시스템 (+10.8%) 등 방산 관련주 전반 상승. 코스피 대형주 호재 속 외국인은 6241억원, 기관은 4976억원을 매수하며 상승폭 확대 견인. 코스닥의 경우 외국인 및 기관 매수세가 코스피에 쏠린 가운데 알테오젠이 2조원 규모의 아스트라제네카 자회사 수출 소식에 +12.1% 급등하며 지수 상승 견인\n미 에너지부 민감국가 지정 우려 속 원전 약세: 업종전반 강세 보인 가운데 한국이 미국 에너지부(DOE)의 민감국가로 분류되었다는 소식 속 두산에너빌리티 (-4.3%) 등 원전 관련주 전반 하락',
      '미국 - 양호한 소비지표 결과에 상승\n- 2월 근원 소매판매 전월대비 0.3% 증가, 컨센서스 부합. 테슬라(-4.8%) 주가 부진에 나스닥 상대적 약세',
      '국내 및 글로벌 증시 동향\n[미국 증시 동향]\n- 뉴욕 증시, 소비지표 개선세에 따른 경기 침체 우려 완화, 저가매수세 유입 등에 3대 지수 이틀 연속 동반 상승\n- 2월 소매판매, 전월비 +0.2%로 예상치 +0.6% 하회, 그러나 핵심 소매판매가 전월비 +1.0%로 경기우려 완화\n- 테슬라는 머스크 CEO에 대한 반감 확산 및 중국 자율주행 SW FSD의 무료 체험판 제공 등에 -4.79% 하락\n- 임의소비재 제외한 모든 업종 상승, 월마트 +2%대 등 소매업체 강세, AMD +3%대 등 반도체지수 +1.42%\n[FICC 시장 동향]\n- 미국 10년물 국채수익률 4.30% (-1.4bp), 소비 안도감 vs. 독일 재정 부양책 부담감 속 장단기물 혼조세\n- 달러 인덱스 103.37 (-0.34%), 독일 재정 부양책 표결 임박에 유로화 강세 이어지며 이틀 연속 하락\n- 유가 67.58달러/배럴 (+0.60%), 후티 반군 공습에 대해 이란에 책임을 묻겠다는 트럼프 압박에 유가 상승\n[중국 및 유럽 증시 동향]\n- 중국 증시, 양호한 지표 결과와 소비 진작 세부 부양책 기대감 속 상승세 연장되었으나 상승 탄력은 둔화\n- 유럽 증시, 독일 재정 개혁안 표결 임박, 우크라이나 전쟁 종식 협상 위한 트럼프-푸틴 통화 앞두고 상승\n[오늘의 관전 포인트]\n- 트럼프 대통령이 우크라이나 전쟁 종전 협의를 위해 푸틴 대통령과 통화 계획 밝혀 지정학적 우려 감소 기대\n- 전일 국내 증시는 외국인과 기관 수급 유입되며 강세, 전기전자가 시장 견인한 가운데 KOSPI 2,600선 회복\n- 금일 금통위 의사록 공개, 익일부터 주요국 통화정책 회의 예정. 불확실성 요인 존재하나 반등 추세는 유효',
      "배출권/에너지 관련 뉴스\n[뉴욕유가] '후티 통제하라' 이란에 경고한 트럼프…WTI 0.6%↑\nhttps://www.yna.co.kr/view/AKR20250318008000009?section=search\n건물 온실가스' 정점 찍었나…'건설-배출량 탈동조화' 첫 확인\nhttps://www.news1.kr/society/environment/5721705\n독일 탄소배출량 전년 대비 3.4% 감소…2030년 기후 목표 달성 궤도에 올라\nhttps://www.impacton.net/news/articleView.html?idxno=14400",
      '리스크 해소 및 양 시장 댜형주 캐리\nKOSPI, KOSDAQ은 각각 1.7%, 1.3% 상승했습니다. 미국 임시예산안(6개월)이 주말 간 통과되면서 셧다운 우려가 일단 해소된 점, Trump의 관세 등 발언이 부재했던 점도 안도로 작용했습니다. 중국 경기지표도 생산·투자·소비 모두 시장 예상을 상회하며 내수 회복 기대감 강화된 점도 긍정적으로 작용했습니다. KOSPI 2,600p 돌파하며 재차 200일선에 근접했고, Nvidia GTC 2025 기대 반영되며 반도체 대형주 강세였습니다. 특히 삼성전자(+5.3%)는 작년 11월 중순 10조원 자사주 매입 발표 후 처음으로 5% 이상 상승 마감했습니다. KOSDAQ에서는 알테오젠(+12.1%)이 AstraZeneca 자회사와 ALT-B4 라이선스 계약 체결하며 지수 끌어올렸습니다.',
      '장 마감 코멘트\n- KOSPI 2,610pt (+1.73%), KOSDAQ 743pt (+1.26%)\n- 반도체주가 지수 견인하며 양 시장 +1%대 강세, KOSPI 2,600선 돌파 마감\n- 지난 금요일, 조정 국면 진입했던 미 증시가 반등하며 국내 증시도 상승 출발\n- 주말 사이 트럼프 대통령의 서명이 완료되며 미 정부의 셧다운 우려는 해소\n- 미 소비자심리 지수는 22년 11월 이후 최저치 기록하며 부진했으나 시장 영향은 제한\n- 현지시간 17일부터 열리는 엔비디아의 GTC 2025로 인해 반도체, AI주들에 대한 기대감이 높아진 가운데 최근 D램 가격 반등세, 미 반도체법 전면폐기 가능성 하락, 중국발 칩 수요 확대 기대 등 여러 요인들이 업종 투자심리 개선에 영향\n- 이에 삼성전자가 +5% 넘게 급등하며 지수 견인했고, SK하이닉스는 +0.73% 상승\n- 조선, 방산, 엔터 등도 각각 모멘텀에 강세 보인 반면 원전, 석유화학은 약세\n- 이번 주 많은 일정들이 대기. FOMC, BOJ, BOE, 중국 LPR 금리 결정 등 주요국 통화정책회의가 몰려 있으며 금통위 의사록도 공개 예정\n- 또한 탄핵심판 선고일이 20~21일로 높게 점쳐지는 가운데 불확실성을 키울 변수로 작용할 수 있어 대비 필요',
      '■ 시장 리뷰 &amp; 코멘트\n▶ 한국 증시\n코스피지수는 전장대비 44.33pt(+1.73%) 상승한 2,610.69pt에 마감. 삼성전자 급등하며 반도체와 방산주 강세에 따라 상승 마감\n▶ 미국 증시\n다우지수는 전장대비 353.44pt(+0.85%) 상승한 41,841.63pt에 마감. 장 초반 하락했으나 2월 소비 판매 회복세 보이자 상승 전환하며 마감\n▶ 아시아 증시\n닛케이지수는 전장대비 343.42pt(+0.93%) 상승한 37,396.52pt에 마감. 미국 나스닥지수 상승에 따라 반도체 관련주 중심으로 상승 마감\n상해종합지수는 전장대비 6.57pt(+0.19%) 상승한 3,426.13pt에 마감. 경제 지표 회복세 보였으나, 부동산 시장 침체 지속으로 상승 폭 제한되며 마감',
      "중국 내수회복 기대, 반도체 중심 KOSPI 훈풍\n&nbsp;\n- 전기전자 업종을 중심으로 외국인 투자자 저점매수세 유입, 중국의 내수회복 기대와 반도체 D램 가격 반등 추세, 레거시 반도체 업황 턴어라운드 전망 고조\n- 중국의 실물지표 예상치 상회, 2월 소매판매는 예상치 3.8%보다 높은 전년대비 4.0% 증가, 산업생산 5.9%, 고정자산투자 4.1% 증가 역시 시장 예상치를 상회 - 중국 판공청, 주말간 '소비진작 특별 행동계획'을 발표하며 중국 인민의 소비를 적극적으로 진작시킬 것을 천명, 공연 기획사 투자유치 및 인센티브 계획 포함\n- 반도체, 엔터 등 업종 기대감 강화된 반면 최근 중국 구조조정 기대감으로 올랐던 철강, 화학, 2차전지 소재 등 업종은 비교적 약한 모습, 중국 회복에 대한 신뢰도 높아진다면 향후 중국 소비주 등으로도 순환매 전이, 강화될 수 있음&nbsp;\n반도체: 삼성전자(+5.3%), 테크윙(+8.0%), 주성엔지니어링(+12.0%) 등&nbsp;\n엔터테인먼트: 하이브(+2.8%), 에스엠(+2.4%), 와이지엔터테인먼트(+2.1%) 등&nbsp;",
      '2월 기업 수 : 비상장 피투자기업 수는 최근 5년 평균 수준\n&nbsp;\n- 2월 비상장 피투자기업 수는 최근 5년 평균 수준 100개(스타트업레시피 집계). 과거 8년 평균 보다는 높지만, 최근 5년 평균 대비 유사하거나 소폭 높은 수준\n- 올해 2월에 11개 기업이 IPO에 성공. 최근 8년 IPO 기업은 평균 7개 대비 높은 수준이었으나, 최근 5개년 평균 10개사 대비 유사한 수준이었음.\n- 결론적으로 2월 기준으로는 비상장 피투자기업 수는 IPO 상장 기업 수 대비 거의 8~9배 수준이며, 5sus 평균 수준이었음.',
      '트럼프 시나리오: 세 가지 단계로의 국면 구분\n&nbsp;\n보다 노련해진 트럼프는 1기 정책실기를 반면교사로 치밀하고 강경한 정책 노선을 계획하고 있다. 미국 우선주의와 제조업 재건의 큰 그림을 유지하면서 정책 부작용을 최소화하는 전략이 예상된다. 세 단계로 구분된다. 현 시점은 Stage1(중국/멕시코/캐나다)에서 Stage2(유럽/아시아)로의 전환 단계다. Stage2 시작은 러우전쟁 종식이 선결돼야 한다. 1) 에너지+농산품 공급 확대(인플레이션 제어)에 정책 운신의 폭은 넓어지고 2) 광물협정으로 중국의 희토류 규제 위험 제어, 3) 미국 국방 전선이 중국으로 집중되는 효과까지 가진다. Stage3는 미중 분쟁의 전면전이며 통상으로 시작해 기술, 금융, 군사 위험으로 확산되는 패턴이다. Stage2에서 한국 정책 불확실성 고조 예상되고 미중 분쟁 불안에도 대비가 필요하다. &nbsp;',
      '3월 4주차 Digital Asset Comment\n&nbsp;\n트럼프발 관세 리스크 잔존한 가운데 위험자산 회피심리 지속. 비트코인 현물 ETF에서 5주 연속 자금 순유출되었으나 비트코인 8만달러대 지지하는 모습 보이며 크립토 서밋 이후 하락분 일부 회복하는 모습 보임. 한주간 시총 상위 알트코인인 이더리움(3.6%), 리플(13.2%), 솔라나(8.5%) 등 상승한 가운데 북한이 세계에서 3번째로 비트코인을 많이 보유하고 있다는 소식이 전해짐. 이는 지난달 바이비트가 해킹 조직인 라자루스에게 약 2조 1천억원 상당의 코인을 탈취당한 이후 북한의 비트코인 보유량이 크게 늘어난 것으로 추정. 탈취당한 코인은 대부분 이더리움이었으며 상당수 비트코인으로 전환되었을 것으로 예상되고 있는 상황임\n&nbsp;',
      '경기, 정책, 유동성 모멘텀 모두 여전히 우호적\n&nbsp;\n최근 중국당국은 2월 통화공급 및 신용 증가율 지표, 소비 부양책, 2월 실물지표를 발표했다. 일부 시장 기대보다 부진한 부분도 있었지만, 대체로 견조한 모습을 보이면서, 최근 중국증시 상승세에 일조하였다. 먼저, 18일 발표한, 실물지표는 부동산 제외, 모두 시장 기대를 상회하는 모습을 보였다. 2월 누적 산업생산은 전년대비 5.9% 성장하면서, 시장 컨센서스를(YoY+5.4%) 큰 폭으로 상회했다. 소매판매는 전년대비 4% 성장하면서, 시장컨센서스(YoY+3.8%) 및 이전치를(YoY+3.7%) 모두 웃돌았다. 전월비 증감율 또한 춘절 효과를 감안해도, 3개월 연속으로 반등하는 등 고무적인 모습을 보였다. 고정자산투자는 전년대비 4.1% 성장, 역시 시장 컨센서스(YoY+3.2%) 및 이전치를(YoY+3.2%) 모두 상회했다. 소매판매 세부항목을 살펴보면, 자동차를 제외, 대부분 항목이 견조한 모습을 보였다. 특히 통신기기 가전 및 가구 등 소매판매 회복세가 두드러졌는데, 이구 환신 등 소비 부양책 효과가 반영되고 있다고 생각된다. 동기간(2월 누적 기준), 사회융자총액, 신규 위안화 대출은 각각 9.3조, 6.1조 위안을 기록, 시장 컨센서스를(각각 9.8조, 6.4조) 하회했다. 그러나 M2 통화공급은 전년대비 7% 증가하면서, 시장 컨센서스 및 이전치에 부합하는 모습을 보였다. 가장 중요한 사회융자총액 증가율 및 신용 자극 지수 모두 반등하는 모습을 이어가면서, 유동성 모멘텀은 여전히 증시에 우호적이라 판단한다. 다만 여전히 소비 증가율이 절대적으로 낮은 수준이며, 예상보다도 더욱 부진한 부동산 투자, 다시 반등한 실업률 등 감안하면, 경기 부양책 중요성은 전혀 낮아지지 않았다. 이와 관련하여 16일 중국당국은 소비 촉진 행동방안을 발표했다. 소득 증가를 최우선 과제로 꼽으면서, 자산 소득의 중요성을 특히 강조했다. 이를 위해 주식 및 부동산 시장 안정화 대책 또한 내놓았는데, 부동산 회복을 위해, 지방정부의 주택 재고 매입 방안이 다시 언급되었다. 결국, 부동산 과잉재고 해소 및 소득(가계체력) 회복 여부에 따라 소비 회복 탄력이 결정될 것으로 판단된다.',
      '1~2월 소매판매, 산업생산, 고정자산투자 일제히 컨센서스 상회\n&nbsp;\n중국 1~2월 누적 동행지표는 소비, 생산, 투자 일제히 예상치를 상회했다. 소매판매는 이구환신 정책 효과로 전년동기대비 4.0% 늘며 3개월 연속 개선세가 확대됐다. 산업생산은 전년동기대비 5.9% 증가해 예상치(+5.3%)를 재차 웃돌았다. 고정자산투자는 전년동기대비 4.1% 늘며 작년 4월 이후 가장 높은 증가세를 보였다. 도시실업률은 5.4%로 전월(5.2%) 대비 하락하며 고용 부진이 지속됐다.',
      '관세가 조정의 명분일지언정, ‘본질’은 아닌 이유\n&nbsp;\n지난 4주간 주식시장이 겪었던 매도세의 가장 중요한 이유로써 트럼프의 관세 정책이 제시되고 있다. MAGA가 사실은 Make rest of America Great Again이었냐는 비아냥도 나온다. 그러나 우리는 관세와 미국우선주의 정책이 미국 증시 투매에 일정 부분 기여했을지언정 투매의 진정한 본질은 아니었다고 판단한다. 앞으로도 관세는 시장 조정의 좋은 명분일지언정 ‘본질’이 아닐 가능성이 높다.',
      '증시 코멘트 및 대응 전략\n&nbsp;\n17일(월) 미국 증시는 3월 주택심리지수 부진, BYD의 신규 충전시스템 공개에 따른 테슬라(-4.8%) 약세에도, 2월 핵심 소매판매 호조, 3월 이후 연쇄 조정에 따른 진입 가격 메리트 부각 등에 비 기술주를 중심으로 상승 마감(다우 +0.9%, S&amp;P500 +0.6%, 나스닥 +0.3%). 3월 NAHB 주택시장지수(39pt vs 컨센 42pt), 2월 소매판매(+0.2%MoM vs 컨센 +0.6%)의 부진은 지난 금요일 미 시간대 소비심리지수 급랭을 뒷받침해주는 데이터로 해석될 수 있었음. 하지만 자동차, 휘발유, 건자재 등 변동성이 큰 품목을 제외한 컨트롤그룹 소매판매(+1.0%MoM vs 컨센 +0.2%)가 서프라이즈를 기록했다는 점에 주목할 필요. 아직까지 미국 실제 소비경기가 침체의 현실화 확률을 높일 정도로 훼손되지 않았음을 시사. 사실 이보다 고민거리는 이전엔 안 그랬던 미국 증시가 한국 등 여타 증시에 비해 관세에 취약성을 드러내고 있다는 점이며, 이는 다음과 같은 요인에서 기인. 1) 지난 2년간 랠리에 따른 밸류에이션 부담 및 쏠림현상 부작용, 2) 1월 말 딥시크 충격, 3) 제조업 PMI(ex: ISM, 뉴욕연은), 소비심리지수 등 소프트데이터 부진이 S&amp;P500과 나스닥을 고점대비 10% 이상 하락하게 만드는 과정에서 관세의 부정적인 영향력을 높이고 있는 것으로 판단. 3월 10~13일 블룸버그의 설문에서도 비슷한 결과를 확인할 수 있음. 이번 설문에는 올해 남은 기간 동안 미국 증시의 방향성을 결정하는 요인으로 “연준 정책(응답률 19%)”보다 “관세(81%)”가 압도적으로 높은 응답률을 기록. 또한 미국 증시 조정이 지속될 시 “연준 풋(28%)”보다 “트럼프 풋(40%)”이 먼저 발동될 것이라는 응답률이 높다는 점도 관세 민감도가 높아졌음을 유추할 수 있는 대목. 이를 종합해보면, 최근 미국 주가 조정이 과도했다는 점이나 침체 내러티브도 과장됐다는 의견은 설득력이 있음. 다만, 딥시크 사태의 충격이나 관세 불확실성은 높은 수준을 유지하고 있다는 점을 감안 시, 미국 증시의 추세적인 회복 or 전세계 대장주 복귀는 시간이 필요한 사안으로 접근하는 것이 적절. 전일 국내 증시는 지난 금요일 미국 증시의 급반등 효과, 중국의 실물지표 호조, 삼성전자(+5.3%) 등 반도체 업황 회복 기대감, 알테오젠(+12.1%)의 기술이전 계약 소식 등에 힘입어 1%대 급등(코스피 +1.7%, 코스닥 +1.2%). 금일에는 미국 소비 경기 불안 완화 vs 트럼프 관세 경계감 등 상하방 요인이 혼재한 가운데, 전일 반도체, 바이오를 중심으로 장중 급등에 따른 일부 차익실현 물량 출회 등으로 박스권 흐름 예상. 한편, 외국인은 월간 8개월 연속 코스피 순매도를 기록하는 등 지난 8월부터 셀코리아를 단행해왔던 상황(해당기간 누적순매도 금액 약 29.3조원). 그 가운데, 전일 외국인이 코스피에서 약 6,100억원 순매수하면서 올해 1월 16일(6,240억원) 이후 최대 순매수를 경신하면서 8개월 연속 순매도 종료 기대감이 생성 중. 동시에 1월 16일에는 SK하이닉스(4,850억원 vs 삼성전자 552억원) 중심으로 순매수를 했다면, 전일에는 삼성전자(4,900억원 vs SK하이닉스 -118억원)를 중심으로 순매수했다는 점이 차별화되는 요인. 이번에 외국인이 삼성전자 매수세에 집중한 것은 중국의 1~2월 소매판매(4.0%YoY, 컨센 3.8%), 산업생산(5.9%YoY, 컨센 5.3%) 등 실물 지표가 이구환신 효과로 호조세를 기록한 데서 찾을 수 있음. 과거보다 중국에 대한 한국 경제 의존도가 낮아지기는 했지만, 이구환신의 수혜를 받는 반도체 등 IT 품목들은 수혜를 입을 수 있다는 것이 중론(25년 2월 수출 기준, 한국 전체 수출 내 대중 수출 비중 18.1% vs 1위는 미국향 수출 18.9%). 주말에도 중국 정부가 소득 증대, 서비스 소비 질적 향상, 증시 안정화 정책을 발표했다는 점도 눈에 띄는 부분. 물론 과거 여러 차례 중국의 경기 기대감이 무위로 돌아간 전력이 있기에, 향후 중국 소비 호조세가 지속적으로 수반되어야 국내 반도체주의 주가 모멘텀에 지속성을 부여하게 될 것. 다만, 내일(19일 새벽) 예정된 GTC 2025 이벤트가 부분적인 촉매를 제공할 수 있는 만큼, 금일 국내 반도체주들은 단기 눈치보기 장세에 돌입할 전망. .',
      'FX: 유로화, 경기 부양 기대에 상승\n&nbsp;\n달러화는 미국 소매판매가 시장 예상치를 하회한 가운데 뉴욕 제조업지수도 부진하게 발표되면서 하락 미국 2월 소매판매는 전월대비 0.2% 증가하며 전월(-1.2%)보다 개선되었지만 시장 예상(0.6%)은 하회. 3월 뉴욕 제조업지수도 -20.0을 기록하며 전월(5.7)과 시장 예상(-1.9)을 크게 하회하며 경기 둔화에 대한 우려 확산. 반면, 유로화는 독일 차기 정부의 인프라 특별기금 설치에 따른 경기 부양 기대감이 지속되면서 달러 대비 강세. NDF 달러/원 환율 1개월물은 1,441.09원으로 5.01원 하락 출발할 것으로 예상하며 달러 약세 등을 고려할 때 완만한 하락세를 보일 것으로 전망',
      '좋았지만 아직 필요한 정책 지원\n&nbsp;\n1-2 월 중국 경기지표는 예상보다 좋았다. 여전히 공급 우위 국면이지만 주요 지표는 모두 시장 예상치를 상회했다. 1-2 월 산업생산은 +5.9%yoy, 고정자산투자는 +4.1%yoy, 소매판매는 +4%yoy 를 기록했다. 정부 주도의 투자가 원활하게 진행되면서 인프라 투자가 +10%yoy 로 반등했고, 제조업 투자도 +9%yoy 로 견조한 성장세를 이어갔다. 소비 역시 이구환신 정책효과로 통신 기기 판매량이 +26.2%yoy 로 급증했고, 반면 기존 이구환신 정책 대상이던 가전 소비는 +10.9%yoy 로 소폭 둔화했고, 자동차 소비는 -4.4%yoy로 감소 전환했다. 다만 부동산 경기는 다시 부진해지는 모습을 보였다. 부동산 투자는 -9.8%yoy로 부진한 모습이 지속되었고 특히 부동산 부양 정책 효과가 약화되면서 부동산 판매 면적 증가율은 -5.1%yoy 로 3 개월 만에 다시 감소 전환했다. 1 선 도시의 부동산 가격 또한 전년동기대비로는 감소폭이 축소되었으나 전월대비로는 다시 하락했다. 도시 조사 실업률 또한 5.1%에서 5.4%로 확대되며 내수 회복이 안정적이지 않은 모습이다. 최근 몇 년간 중국 경제는 1Q 서프라이즈, 2Q 경기 둔화, 3~4Q 경기 개선의 U자형 형태를 나타내는 경향이 있는데 이번 역시 크게 다르지 않을 것으로 보여진다. 1-2 월 수출 데이터는 양호했으나 관세 인상 여파가 점차 나타날 예정이며 내수 회복은 여전히 정책적 지원이 필요한 상황이다.&nbsp;',
      "Comment\n&nbsp;\n- 17일(월) 한국 증시는 외국인 매수세에 힘입어 2,610대에서 마감(KOSPI+1.73%, KOSDAQ +1.26%). 지난 2월 27일 이후 11거래일 만에 코스피가 종가 기준으로 2,600선 위로 올라선 양상. 유가증권시장에서 외국인과 기관은 각각 6천173억원, 4천959억원 순매수했고, 개인은 1조1천822억원 순매도. 최근 레거시 반도체 업황의 반등 조짐이 보이는 가운데 엔비디아 개발자 회의 'GTC 2025' 기대감까지 유입되자 반도체주가 지수 상승세를 견인. 삼성전자는 외국인 매수세에 힘입어 5.3% 급등했고 SK하이닉스(0.73%), 주성엔지니어링(11.96%) 등 다른 반도체주도 강세. 여기에 중국의 1~2월 소매판매와 산업생산이 시장 예상치를 웃돌며 중국 경기 개선에 대한 기대감이 커진 점도 시장에 안도감을 불어넣었던 요인. 특히 한화에어로스페이스(6.81%), 한국항공우주(10.85%), 현대로템(7.28%) 등 대표 방산주가 장중 52주 신고가를 경신하며 상승세에 탄력을 가세.",
      '1~2월 중국 주요 경제지표 서프라이즈에도 불구하고 내실은 아직 미흡\n&nbsp;\n중국 1~2월 주요 핵심 경제지표라 할 수 있는 소매판매, 산업생산 및 고정투자가 시장 예상치를 상회하는 서프라이즈를 기록하여 외형적으로는 회복 기미를 보였지만 내실은 미흡하다고 평가된다. 무엇보다 중국 정부의 강력한 의지에도 불구하고 내수 경기 회복세는 미약하다. 1~2월 소매판매의 경우 이구환신 정책 등으로 증가율이 다소 반등했지만 소비경기 회복 지속성을 결정할 고용 그리고 부동산 경기는 여전히 회복 기미를 보여주지 못했다. 2월 실업률의 경우 5.4%로 지난해말(5.1%) 및 시장예상치(5.1%)를 큰 폭으로 상회했고 청년실업률 역시 지난해 12월 15.7%에서 2월 16.5%로 0.8%p나 상승했다. 이는 정부 내수 회복책의 온기가 확산되지 못하고 있음을 반증한다. 중국 경제, 특히 내수경기 회복에 가장 걸림돌인 부동산 경기도 회복 조짐이 미약하다. 대표적으로 대도시 주택가격의 경우 전년동월 기준으로 하락폭은 축소되고 있지만 가격 하락세가 42개월째 이어지고 있다. 엄밀히 보면 주택가격이 사실상 정체된 체 방향성을 찾지 못하는 모습이다. 이에 따라 1~2월 부동산투자는 전년동월 -9.8%로 지난해 12월(-10.6%)보다 감소폭은 개선되었지만 부동산 투자 회복을 언급하기는 시기상조이다. 또 다른 주요 부동산지표 중에 하나인 신규 착공면적 증가율 역시 1~2월 -29.9%로 지난해말 -22.5%에 비해 감소폭이 확대되었다. 그나마 위안을 삼을 수 있는 것은 &lt;그림5&gt;에서 보듯 중국 부동산 체감지수 개선세가 일부 가시화되고 있다는 점이다. 이러한 내수경기 부진 지속 현상이 종합적으로 반영된 것이 소비자물가가 아닌가 싶다. 2월 중국 소비자물가는 전년동월 -0.7%의 하락세를 기록한 바 있다. 소비자물가가 하락한 것은 지난해 1월 이후 13개월만이다. 생산자물가 역시 24개월째 하락세를 보이고 음은 물론 개선 조짐을 보이지 못하고 있다는 점에서 중국 경제가 내수 경기를 중심으로 디플레이션 리스크를 벗어나지 못하고 있음을 시사한다. 그래도 1~2월 고정투자 증가율이 시장예상치인 전년동월 3.2%보다 0.9%p 높은 4.1%를 기록한데 이어 인프라 투자의 바로미터라 할 수 있는 굴삭기 판매량이 2월 큰 폭으로 증가한 것은 긍정적이라고 평가된다.',
      '전일 국내 채권 시장 요약\n- 금리방향: 상승(3Y), 하락(10Y)\n- 일드커브: 플래트닝\n- 스프레드(bp): 국5/3 3.3 (-2.0) 국 10/3: 20.8 (-2.0) 국 10/5: 17.5 (0.0) 국30/10: -21.5 (1.0)',
      '국내 채권시장 동향\n- 국내 채권시장 혼조세 마감.\n- 전일 미국채 금리가 기대인플레 급등 여파로 상승한 점 반영, 약세 출발. 뉴욕 증시가 2% 이상 오르는 등 위험 선호가 회복된 점도 영향을 미침.\n- 추경 관련 여야간 합의는 난항을 이어감. 여당측 수석 대변인, 야강이 제안한 35조원 내외 규모는 받아들이기 힘들다는 입장을 강조.\n- 이러한 가운데 오후 중 외국인은 10년 국채선물 중심 순매수세 강화. 금리는 보합권 수준에서 혼조세를 시현.',
      '킥스(K-ICS) 기본자본 강화 및 감독기준 합리화 조치 발표. 금감원은 현행 킥스비율 150%에서 10~20%p 수준 인하를 검토\n3/12일 금융감독원은 「보험업권 자본규제 고도화 방안」을 발표했다. 주요 내용 중 하나는 킥스(K-ICS) 기본자본 강화 및 감독기준 합리화 방안이다. 해당조치의 원론적 배경은 신제도(IFRS17, K-ICS) 시행 2년이 경과하여 안정기에 진입함에 따라 구제도(IFRS4, RBC)에 기초한 자본규제 정비의 필요성이 증가했다는 점인데, 세부적으로는 후순위채 중도상환 등의 인허가 감독기준이 여전히 구제도(RBC)와 동일하게 적용되고 있어 후순위채와 같은 자본증권 발행액이 급증하고, 기본자본 관리는 소홀함이 지적되고 있음이 지적됐다. 실제로 보험업권의 킥스비율은 23.3월말 219%에서 24.9월말 218.3%로 소폭 하락(-0.7%p)한 반면 손실흡수성이 부족한 자본을 제외한 기본자본 킥스비율은 23.3월말 145.1%에서 24.9월말 132.6%로 -12.5%p 크게 하락했다. 사실 보험사의 자본규제 감독기준은 킥스 150%로 높게 설정된 반면, 기본자본 킥스비율은 경영실태평가 항목으로만 활용되어 왔으며, 이로 인해 감독기준 충족을 위한 자본증권 발행이 급증하며 이자비용 등 재무부담은 늘고, 자본의 질은 악화되는 부작용이 발생했다. 위 상황들을 고려해 금감원은 현행 킥스비율 150%에서 10~20%p 수준 인하를 검토하고 있으며, 25년 상반기 중 최종방안을 확정할 계획이라고 발표했다. 이 경우 킥스비율이 최대 130%까지 완화될 수 있는데, 해당비율은 은행권 보완자본 중도상환 기준의 킥스준용비율(131.25%) 등이 고려된 것으로 추측된다.',
      '독일 재정 확장, 금리 상승의 서막인가\n2025년 3월 5일 독일을 비롯한 유로존 금리가 일제히 30bp가량 급등. 2월 독일총선 이후 독일 의회에서 향후 10년간 5,000억 유로 규모의 인프라 투자 특별 기금을 편성하겠다고 발표한 영향. 그간의 부채 브레이크 정책 기조를 버리고, 재정 확장 정책을 추진하겠다는 점이 금리 상승의 트리거로 작용. 미국을 비롯한 글로벌 재정 확장 기조에 독일까지 동참하게 되면서 채권시장은 앞으로 통화정책 대비 재정정책의 영향권에 들어오게 될 것. 그 가운데 재정 여력이 확보된 국가일수록 재정을 통한 성장이 기대되며 금리 상승으로 이어질 것. 따라서 영국 등과는 다르게 독일의 재정 확장 정책이 글로벌 채권 투매의 트리거가 되지는 않을 것으로 판단.',
      '■ 주요 뉴스: 미국 2월 소매판매, 예상치 하회. 세부 내용은 극단적인 경기침체 우려 제한\n\r\n   ○ OECD, 금년 글로벌 경제 성장률 전망을 하향. 미국 관세정책의 영향을 반영  \n\r\n   ○ 미국 트럼프 대통령, 4/2일 상호관세 부과. 연준 금융감독 부의장에 보우먼 이사 지명  \n\r\n   ○ 중국 국무원, 내수 부양에 총력. 1~2월 산업생산과 소매판매는 대체로 양호\n\r\n   \n\r\n■ 국제금융시장: 미국은 2월 소매판매가 예상치 하회했으나 양호한 세부내용 평가 등이 영향\n\r\n                주가 상승[+0.6%], 달러화 약세[-0.3%], 금리 하락[-1bp] \n\r\n   ○ 주가: 미국 S&P500지수는 경기침체 우려 완화 속 저가매수 유입 등으로 상승\n\r\n            유로 Stoxx600지수는 독일의 재정지출 확대 및 우크라이나 종전 기대 등으로 0.8% 상승\n\r\n   ○ 환율: 달러화지수는 경기부진 가능성 등으로 하락\n\r\n            유로화 가치는 0.4% 상승, 엔화 가치는 0.4% 하락\n\r\n   ○ 금리: 미국 10년물 국채금리는 경기둔화 전망과 그에 따른 금리인하 기대 강화 등이 원인\n\r\n            독일은 OECD의 유로존 성장률 전망 하향, 저가 매수 유입 등으로 6bp 하락\n\r\n       ※ 뉴욕 1M NDF 종가 1441.1원(스왑포인트 감안 시 1443.8원, 0.09% 하락). 한국 CDS 상승',
    ];

    const prompt = ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{ECONOMIC_INFORMATION}}',
      JSON.stringify(infos),
    );

    const response = await ollamaService.invoke({ prompt });
    console.log(response);
  });
});
