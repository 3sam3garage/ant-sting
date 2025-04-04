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
import pdf from 'pdf-parse';
import { GeminiService } from '@libs/ai';

describe('ollama', () => {
  let moduleRef: TestingModule;
  let geminiService: GeminiService;
  let secApiService: SecApiService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, AiModule, ExternalApiModule],
      providers: [OllamaService, SecApiService],
    }).compile();

    geminiService = moduleRef.get(GeminiService);
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
      // 'https://www.sec.gov/Archives/edgar/data/1747068/000174706820000004/mcbs-20200124x8k.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1747068/000155837019008926/f8-k.htm',
      'https://www.sec.gov/Archives/edgar/data/784539/000110465925032119/0001104659-25-032119-index.htm',

      // 4
      // 'https://www.sec.gov/Archives/edgar/data/1487718/000149315225010524/0001493152-25-010524-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1610520/000161052025000013/xslF345X05/primary_doc.xml',
      // 'https://www.sec.gov/Archives/edgar/data/1671927/000141588925004602/xslF345X05/form4-02192025_090204.xml',
      // 'https://www.sec.gov/Archives/edgar/data/753308/000106299325002690/xslF345X05/form4.xml',
      // 'https://www.sec.gov/Archives/edgar/data/1574197/000157419725000028/0001574197-25-000028-index.htm',

      // 엄청 긴거
      // 'https://www.sec.gov/Archives/edgar/data/1114446/000183988225016087/ubs_424b2-08361.htm',

      // 10-K
      // 'https://www.sec.gov/Archives/edgar/data/1571123/000157112325000022/0001571123-25-000022-index.htm',
      // 'https://www.sec.gov/Archives/edgar/data/1747068/000155837020002934/mcbs-20191231x10k.htm',
    );
    const html = parseHTML(document);
    const body = html.querySelector('body');
    const content = body?.innerHTML ? body?.innerHTML : html?.innerHTML;
    const contents = ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      content,
    );

    const response = await geminiService.invoke({ contents });
    console.log(response);
  });

  it('analyze pdf multimodal', async () => {
    const summary = {
      // href: 'https://stock.pstatic.net/stock-research/company/2/20250320_company_604438000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/21/20250320_company_798363000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/16/20250319_company_212300000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/62/20250319_company_986497000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/31/20250403_company_277023000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/63/20250402_company_367848000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/57/20250401_company_622360000.pdf',
      href: 'https://stock.pstatic.net/stock-research/company/16/20250401_company_206120000.pdf',
    };

    const pdfResponse = await axios.get(summary.href, {
      responseType: 'arraybuffer',
    });
    const file = await geminiService.upload({
      data: new Blob([pdfResponse.data]),
      mimeType: 'application/pdf',
    });

    const response = await geminiService.invoke({
      contents: [
        GEMMA_ANALYZE_PDF_STOCK_REPORT,
        { fileData: { fileUri: file.uri } },
      ],
    });

    let reportResponse = response;
    if (Array.isArray(response)) {
      reportResponse = response.pop();
    }

    console.log(reportResponse);
  });

  it('analyze pdf in text', async () => {
    const summary = {
      href: 'https://stock.pstatic.net/stock-research/company/31/20250403_company_277023000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/2/20250320_company_604438000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/21/20250320_company_798363000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/16/20250319_company_212300000.pdf',
      // href: 'https://stock.pstatic.net/stock-research/company/62/20250319_company_986497000.pdf',
    };

    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
    const pdfFile = await pdf(item.data, { max: 2 });

    const contents = GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED.replace(
      '{{PDF_EXTRACTED_TEXT}}',
      pdfFile.text,
    );

    const response = await geminiService.invoke({ contents });
    console.log(response);
  });

  it('analyze economic-information', async () => {
    const infos = [
      '[전일 해외시장 요약]\n- 미국증시: Dow (-2.08%), S&amp;P500 (-2.70%), Nasdaq (-4.00%)\n- 미국증시, 트럼프의 경기 둔화 언급에 경기 우려심리가 확대되며 하락\n- 트럼프, 침체에 대해 예상하고 싶지는 않지만 새로운 무역 및 기타 정책들이 시행되며 미국은 큰 전환기에 들어섰다고 밝히며 침체 가능성을 배제하지 않는다는 점을 시사\n- 미 연준이사, 현재 고려 중이거나 이미 시행된 일부 정책에 의해 물가가 다시 오를 수도 있다고 경고',
      '주요 뉴스\n- Summary: 주식시장의 친구가 아닌 트럼프, 경기 침체 불사 표현에 증시 폭락. S&amp;P 500 -2.7%\n- 트럼프 인터뷰: 침체 불사하고 고율 관세를 밀어붙이겠다는 TV 인터뷰. 최근 주가 하락 무신경한 모습\n- 정책 불확실성 고조: 트럼프 풋 부재 실망감에 위험자산 투매. S&amp;P 500과 나스닥 200일선 하향돌파\n- M7 폭락: 테슬라 15% 하락하며 5년내 최악의 날. 대선 이후 상승분 모두 반납. 이외 M7도 투매 급락\n- 은행주도 폭락: 트럼프 침체 불사 발언 속 JP모건, BofA 4% 하락. 웰스파고, 모건스탠리도 6%대 하락\n- 무차별 자산투매: 금리인하 기대감이 강화함에도 불구, 달러 강세 / 금 가격도 하락 / WTI도 1.5% 하락\n- 업종: 유틸리티/에너지는 상승, 필수소비재는 약보합 vs. IT, 경기소비재 3%대 하락. 투기적 성장주 급락',
      'Top down\n글로벌 주식전략\n유럽 주식시장 강세의 본질과 활용방법\nBottom up\n산업 분석\n건설 (비중확대) (25-03) 불확실성 해소의 시작점\n화학 (비중확대) 차가운 업황 vs. 뜨거운 주가\n기업 분석\n하나머티리얼즈 (166090/매수) 실적 체력 확인, 반등을 기대하며\n해외기업 분석\n미쓰비시중공업 (7011.JP) 일본을 겨냥하기 시작한 미국',
      '국내 증시 Comment\n강보합 마감: 국내 증시 외인 현물 순매도에도 불구 선물 매수세가 지수를 받치며 강보합 마감. 최근 중국 양회 기대감 속 급등 나타났던 철강, 화학 업종과 더불어 관세 도피처 역할을 했던 엔터주는 가격 부담 속 조정 나타났으나, 섹터 순환매로 이어지며 S-Oil(+8.7%), SK이노베이션(+6.0%) 등 정유주 포함 가격이 저렴한 업종 강세\n조선에서 엔진으로: 조선주 역시 지난 주가 급등 속 가격 및 밸류에이션 부담, 그리고 조선 업황 지표가 둔화되는 모습 나타나며 약세 흐름 나타났으나, 투심이 상승여력이 열려있는 엔진 업종으로 연결되며 한화엔진(+5%), HD현대마린엔진(+15%) 급등. 한편 비슷한 시기 주도주였던 방산 업종은 강세 지속, 한화시스템(+5.4%), 한국항공우주(+5.1%). 다만 방산 내 대장주 격이었던 한화에어로스페이스(-3.9%) 외인 차익실현 속 하락하며 차별화된 흐름',
      '미국 - 트럼프 침체 감내 의지에 하락\n- 트럼프 대통령, 경기 침체 감수하고도 자신의 정책을 추진할 것. 기술주 중심 약세',
      '국내 및 글로벌 증시 동향\n[미국 증시 동향]\n- 트럼프가 관세 정책 강행을 위해 경기 침체 및 최근 증시 조정을 용인하겠다는 발언을 하면서 증시 급락\n- 나스닥 -4.00% 하락, -4% 이상인 경우는 2022년 9월 13일 -5.16% 이후 처음. M7 종목 모두 큰 폭 하락\n- 테슬라 (-15.43%), 주요국 자동차 판매량 급감, 1분기 인도량 전망 하향 등으로 약 5년 내 최대 낙폭 기록\n- 뉴욕 연은, 1년 후 재정 상황이 악화할 것이라고 전망한 미국 소비자 비율은 27.4%로 15개월 내 최고치 기록\n[FICC 시장 동향]\n- 미국 10년물 국채수익률 4.21% (-8.8bp), 경기 침체 용인하는 듯한 트럼프 대통령 발언에 큰 폭 하락\n- 달러 인덱스 103.91 (+0.07%), 경기 우려에 위험선호 약화되며 6거래일 만에 상승\n- 유가 66.03달러/배럴 (-1.51%), 경기둔화 가능성에 원유 수요에 대한 우려 확산되며 하락\n[중국 및 유럽 증시 동향]\n- 중국 증시, 부양책에도 CPI가 1년 만에 하락세로 전환했다는 소식에 혼조세. 2월 CPI 전년대비 0.7% 하락\n- 유럽 증시, 미국 관세 정책으로 인한 경기 침체 우려에 일제히 하락, 독일 재정 개혁에 녹색당은 반대 입장 표명\n[오늘의 관전 포인트]\n- 트럼프발 경기 침체 우려로 5월 회의에서 금리가 인하될 확률이 전일 36%에서 47%까지 상승 (FedWatch)\n- 한편, 차기 캐나다 총리에 선출된 마크 카니 당선인이 미국 관세에 강경한 편으로 향후 양국 갈등 심화 전망\n- 미국 스태그플레이션 우려가 심화된 만큼 금주 CPI, 소비자심리지수 등 경제지표 결과의 중요도가 높아질 전망',
      '배출권/에너지 관련 뉴스\n[뉴욕유가] 트럼프가 촉발한 침체 우려…WTI 1.51%↓\nhttps://www.yna.co.kr/view/AKR20250311006400009?section=search\n"라니냐 올봄 지나면 끝"...지구온난화 가속화 우려\nhttps://www.ytn.co.kr/_ln/0104_202503110634309799\n인도네시아, LNG 전환 가속화…가스 수요 급증 예상\nhttps://www.energydaily.co.kr/news/articleView.html?idxno=154004',
      '고용 부진에도 미국 경기 우려 다소 완화\n금일 KOSPI, KOSDAQ은 각각 +0.3%, -0.3% 등락했습니다. 최근 미국 서베이 지표들이 부진해 경기 관련 센티먼트가 약화됐고, 지난 금요일 미국 고용보고서는 이를 일부 확인시켰습니다(비농업고용 15.1만명, 실업률 4.1%). 또한 Trump가 캐나다 일부 제품 대상 상호관세 부과를 선포하는 등 관세 불확실성 지속됐습니다. 다만 Powell이 “미국 경제는 여전히 좋은 위치에 있다”고 연설한 점이 최근 주식시장 하방 압력이었던 경기 우려를 진정시키면서 시장 낙폭 진정됐습니다. 금주 미국 소비자물가(한국시간 : 12일 오후 9시30분)를 비롯한 매크로 지표나 관세 협정, 미-우 협정, 한국 정치 이슈 등 다수 이벤트에 관심이 집중될 예정입니다.',
      '장 마감 코멘트\n- KOSPI 2,570pt (+0.27%), KOSDAQ 725pt (-0.26%)\n- 파월의 경제 낙관에 힘입어 안정적 흐름. 하지만 매수 주체 부재로 상승 폭 제한적\n- 파월 연준 의장, "미국 경제는 여전히 좋은 위치에 있고 노동시장은 견조하며 물가는 2% 장기 목표에 더 가까워졌다"고 언급\n- 업종별로는 정유주가 중국 경기부양 기대감 속 러시아 대형 정유소의 시설 손상 소식에 강세. SK이노베이션 (+6.02%), S-Oil (+8.74%)\n- 방산주는 업종 내 종목별 순환매 나타난 가운데 11일 미국-우크라이나 고위급 회담이 예정되어 있어 휴전 및 유럽 방위비 증액 기대감 유효\n- 반면, 철강주는 오는 12일부터 미국이 예외없이 철강, 알루미늄에 대해 25% 관세를 부과하기로 함에 따라 약세\n- 엔터, 화장품 등은 2월 중국 소비가 당국의 내수 진작 의지 표명에도 부진하게 발표됨에 따라 하락. CPI (-0.7% YoY) 2024년 1월 이후 처음으로 마이너스 전환, PPI(-2.2% YoY)는 29개월 연속 하락세\n- 트럼프가 캐나다와 멕시코 관세의 추가 상향 가능성을 언급하는 등 우려는 여전하나 밸류에이션 매력을 바탕으로 미국 대비 견조한 흐름 및 기존 주도업종의 강세 지속 전망\n- 이번 주 2월 미국 CPI, PPI 및 3월 미시간대 소비심리, 기대 인플레이션 발표 예정되어있으며 이르면 14일 헌법재판소의 탄핵심판 선고가 있을 것으로 예상되어 주목',
      '■ 시장 리뷰 &amp; 코멘트\n▶ 한국 증시\n코스피지수는 전장대비 6.91pt(+0.27%) 상승한 2,570.39pt에 마감. 순환매 장세 속 정유, 보험 업종이 강세 보이며 강보합 마감\n▶ 미국 증시\n다우지수는 전장대비 830.01pt(-2.08%) 상승한 41,911.71pt에 마감. 트럼프 대통령이 경제정책 효과에 대해 경기 침체 가능성을 시사하며 증시 급락\n▶ 아시아 증시\n닛케이지수는 전장대비 141.10pt(+0.38%) 상승한 37,028.27pt에 마감. 소니, 히타치 등 대형 기술주가 약세 보이며 증시 약세에 기여\n상해종합지수는 전장대비 6.38pt(-0.19%) 하락한 3,366.16pt에 마감. 컨센서스를 하회한 중국 2월 CPI YoY 증감률에 영향 받으며 약보합세',
      '3월 3주차 Digital Asset Comment\n&nbsp;\n지난 3.2일 트럼프 대통령 가상자산 5종을 전략자산으로 비축하겠다고 SNS에 언급하면서 전주 초반 가상자산 일시적으로 상승. 그러나 이내 하락하며 높은 변동성 장세 보임. 3.7일 백악관 크립토 서밋에서 압류된 비트코인 전략비축자산 선언, 초크포인트 2.0 폐지, 스테이블 코인 법안 요청 등 언급되었으나 가상자산에 대한 추가 매입 계획은 발표되지 않으며 실망매물 출회. 전주동안 비트코인 현물 ETF에서 -7.99억 달러, 이더리움 현물 ETF에서 1.2억 달러 순유출되며 비트코인 및 이더리움 큰 폭으로 하락하는 모습 보임. 이더리움 큰 폭으로 하락하여 이더리움 도미넌스 하락하는 반면 스테이블 코인 법안 요청이 언급되면서 테더 도미넌스는 상승하는 모습 보임',
      '유럽 강세의 본질: 대세 상승 펀더멘탈 부재하나, 주도-소외주 로테이션 편승\n&nbsp;\n우리는 ① 유럽 주식시장이 대세적으로 상승할 만한 펀더멘탈이 아직 없지만, ② 최근 주도주-소외주 로테이션의 일환으로 유럽 주식시장이 각광받고 있다고 생각한다. ③ 재정정책과 러-우 종전이 향후 유럽의 펀더멘탈을 개선시킬거란 내러티브를 형성하고 있는데, ④ 이런 내러티브들이 유럽 경제와 기업이익에 얼마나 도움이 될지는 미지수이나 ⑤ 수급/모멘텀 공백과 저평가받았던 상황에서는 단기 아웃퍼폼 동인으로는 충분히 작동할 수 있다고 생각한다. 지수 12MF EPS가 개선되고 있지 못하기 때문에, 본격적인 대세 상승장 진입에 대한 판단은 아직 이른 시점이다. 다만 수급상 주도주(미국/일본/대만) 롱 포지션과 소외주(유럽/중국/홍콩) 숏 포지션의 청산과 맞물려있다보니, 미국 기술주가 차익실현을 소화하는 과정에서 이를 커버할 전술적 대안으로는 충분히 고려될 수 있다. 소외주로의 되돌림은 주도주의 급락이 촉발된 이후 3개월 정도 이어졌던 경험을 감안하면 4~5월까지는 아웃퍼폼 기조가 이어질 수 있다.',
      '변동성으로 해석하는 미국 주식시장\n&nbsp;\n지난 2년간 고점을 갱신해왔던 S&amp;P500지수는 연초 이후 -2.4%, 고점 대비 6.6% 하락했다. 미국 경제지표가 최근 계속해서 예상치를 하회하면서 미국 경기에 대한 우려가 높아졌기 때문이다. 2000년부터 2024년까지 미국 증시는 8개 년도를 제외하고는 모두 상승했다. 1월 말 발생한 딥시크 충격과 트럼프발 관세 전쟁 등 미래 불확실성이 커지면서 주식시장의 출렁임 역시 한층 높아진 모습이다. 과거 미국 주식시장은 추세적인 상승기에서도 10% 내외의 건전한 조정은 발생했다. 시장의 센티먼트를 보여주는 VIX 지수는 현재 24.7로 평소 대비 높은 수준이다. VIX 선물 시장은 현재 근월물 가격이 원월물 가격보다 높은 백워데이션 시장으로 정상시장인 콘탱고 시장과 반대되는 모습을 보이고 있다. 현재까지는 추세적인 하락보다는 상승 사이클 내에서의 건전한 조정으로 보이며, 시장 분위기가 개선되면서 VIX 선물시장도 콘탱고로 돌아올 것으로 예상한다. 코로나 이후 백워데이션이 5일 이상 지속됐던 7번 중 5번은 콘탱고 시장으로 전환 이후 미국 주식시장은 한 달간 양(+)의 수익률을 보였다. 또한 과거 S&amp;P500 지수의 단기 저점은 백워데이션 시장일 때 발생했다. 단기적으로는 기술적 반등을 노릴 수 있는 시점이라고 판단한다. 또한 경기 침체 등 주식시장의 추세적 하락 구간이 아니라면, VIX 백워데이션은 투자심리가 과도하게 악화된 상황이었다는 점에서 중장기적으로도 점진적인 매수를 고려해볼 수 있는 시기라 판단한다.&nbsp;',
      '[이번주 투자 Idea?] SPY에 언제 관심 가져야할까?\n&nbsp;\n지난 2년간 고점을 높여왔던 S&amp;P500지수는 연초 이후 -2.4%, 고점 대비 -6.6% 하락\n- 미국 경제지표가 최근 계속해서 예상치를 하회하면서 미국 경기에 대한 우려가 높아진 모습\n- 2000년 이후 미국 증시는 8개 년도를 제외하고는 모두 상승. 추세적인 상승기에서도 10% 내외의 건전한 조정은 발생\n- 지금은 추세적인 하락기인가? 혹은 일시적인 변동성 확대 국면인가?',
      '일본 1월 실질임금 -1.8% YoY, 감소세 전환\n&nbsp;\n3.10일 일본 후생노동성이 근로통계조사를 통해 1월 실질임금이 전년동월대비 -1.8% 감소했다고 발표. 1월 명목임금이 29만 5,505엔으로 전년동월대비 +2.8% 증가했음에도 실질임금 계산에 사용되는 소비자물가지수가 4.7% 상승하며 3개월만에 감소세 전환',
      '2025 양회는 기대한 만큼\n&nbsp;\n경제성장률 5%내외, 재정적자율 4%\n- 이번 중국 양회 내용은 대체로 시장 예상치에 부합, 경제 성장률 5% 내외, 재정적자율 4%는 예상했던 정도.\n- 재정적자율이 이례적으로 GDP의 4%까지 확대되었다는 점에서 정부의 부양 강도가 이전보다 강화되었음을 확인\n- 2025년 중국의 전체 재정 적자는 11.86조 위안으로 전년대비 2.9조 위안 확대\n- 다만 특수채는 4.4조 위안, 특별국채는 1.8조 위안으로 컨센서스를 하회. 트럼프 관세 전쟁의 대응 카드를 남겨둔 것으로 보여짐.',
      '증시 Comment (전일 아시아 증시)\n&nbsp;\n▶ 한국증시\n- 파월의 경제 낙관론에 힘입어 소폭 상승함. 정치적 불확실성에 외국인 투자자의 매도세가 이어졌으나, 개인과 기관 투자자가 매수 우위를 보이며 지수를 방어. 전 거래일 대비 0.27% 상승한 2,570.39P로 마감\n- KOSDAQ은 외국인과 기관 동반 순매도에 하락함. 전 거래일 대비 0.26% 하락한 725.82P로 마감\n▶ 중국증시\n- 중국 경제에 대한 우려로 소폭 하락함. 전날 발표된 CPI 영향이 이어지며 투자심리 위축. 중국 정부의 부양책에도 소비자물가지수가 1년 만에 하락세로 전환되었다는 점이 시장에서 여전히 부정적으로 인식. 전 거래일 대비 0.19% 하락한 3,366.16P로 마감',
      '증시 코멘트 및 대응 전략\n&nbsp;\n10일(월) 미국 증시는 경기 침체 가능성을 내포한 트럼프의 발언, 오너리스크 등으로 1분기 차량 인도 감소 전망이 제기된 테슬라(-15.4%) 폭락 등이 전반적인 증시에 걸쳐 패닉셀링을 초래하며 급락(다우 -2.0%, S&amp;P500 -2.7%, 나스닥 -4.0%).전일 증시 폭락을 유발한 침체 이슈를 짚어보면, 9일 트럼프가 기자 인터뷰의 자리에서 경기 침체를 예상하지는 않지만, 관세 부과를 하는 과정에서 과도기가 찾아올 수 있다고 언급하는 등 침체 가능성을 배제 하지 않음을 시사. 이는 증시 참여자들로 하여금 침체 리스크를 주가에 반영하게 만들고 있는 실정. 지난 금요일 트럼프 풋은 없을 것이라는 식의 입장을 취한 스캇 베센트 장관 발언의 여파도 잔존하고 있는 상태. 그렇지만 미국의 경기 모멘텀을 측정하는 경기서프라이즈 지수가 10일 기준 -6.9pt대로 지난 8월 침체 내러티브 확산 당시 레벨인 -40pt대에 크게 미치지 못한다는 점을 상기해볼 시점. Factset에서 12월 16일~3월 6일까지 실적을 발표한 S&amp;P500 기업들의 컨퍼런스 콜에서 “침체”를 언급한 기업들이 13개로 과거 5년 평균(80개), 10년 평균(60개)를 큰 폭 하회하고 있다는 점도 마찬가지. 아직까지 침체의 예후가 등장하지 않고 있음을 유추할 수 있는 대목. 동시에 전일 나스닥 4%대 급락은 지난 8월 5일 엔캐리 사태와 침체 불안이 중첩됐던 블랙먼데이(-3.4%)보다 더 크게 하락했다는 점도 눈여겨볼 부분(+현재 나스닥은 직전 고점 대비 하락률이 14.8% vs 8월 5일 당시 직전 고점 대비 하락률이 15.1%). 이를 종합하면 트럼프 발 침체 불안에서 기인한 전일의 미 증시 폭락은 과도한 측면이 있다고 판단. 또 전일 폭락으로 나스닥의 선행 PER이 25배를 기록하면서, 30배 내외를 넘나들었던 지난해 연말에 비해 밸류에이션 부담을 덜어냈다는 점도 같은 맥락에서 접근해봐야 함. 결국, 현 시점은 위험 관리가 필요한 구간인 것은 맞지만, 미국 주요 지표 이벤트, 트럼프 정부의 관세 대응 수위 변화 여부를 확인해가면서 투매 동참 보다는 중립 포지션(보유)로 대응해 나가는 것이 적절. 전일 국내 증시는 지난 금요일 파월 의장의 시장 친화적인 발언 등으로 상승 출발했으나, 이후 상호관세 불확실성, 중화권 증시 조정 등에 따른 외국인 순매도 확대 여파로 전강 후약의 장세로 마감(코스피 +0.3%, 코스닥 -0.3%). 금일에는 트럼프 발 침체 우려,, 테슬라(-15.4%), 엔비디아(-5.1%), 애플(-4.8%) 포함 M7 동반 약세 등 미국발 악재로 하락 출발할 전망. 다만, 트럼프의 침체 관련 발언은 전일 국내 증시 장중에 일정부분 산 반영된 것도 있으며, 전일 미 증시 폭락은 투매에 가까운 성격이 짙다는 점에 주목할 필요. 이를 감안 시 국내 증시도 미국 선물 시장의 반등 여부를 주시하면서 낙폭을 되돌림 해나갈 것이며, 미 증시에서 머크(+1.9%), 모더나(+1.5%) 등이 선방했던 것처럼, 금리 하락 수혜 및 경기 방어주 성격이 혼재된 바이오 등 개별 재료에 따른 순환매 장세가 장중 전개될 것으로 예상.',
      'FX: 엔화, 미국 국채금리 하락에 달러 대비 상승\n&nbsp;\n달러화는 미국 경기 침체에 대한 우려가 높아지면서 미 국채금리 하락과 함께 약세를 보였으나 뉴욕증시 급락 등 금융시장 내 안전자산 수요가 유입되면서 강보합권에서 마감 트럼프 대통령이 경기침체에 대한 질문에 과도기에 있다고 답변. 여기에 뉴욕 연은의 소비자기대조사에서 인플레이션에 대한 우려와 향후 재정상황이 더 나빠질 것으로 예상하는 가계의 비중이 늘어나는 등 경기 침체에 대한 우려 확산. 이로 인해 미 달러가 약세를 보였으나 뉴욕증시 급락으로 금융시장 내 안전자산 수요가 유입되면서 소폭 반등 마감 NDF 달러/원 환율 1개월물은 1,457.24원으로 0.74원 상승 출발할 것으로 예상하며 대외 불확실성 등에 소폭의 상승세를 보일 것으로 전망',
      'I. 국내 법인, 가상자산 시장 진입 시작\n&nbsp;\n글로벌 상장 기업의 비트코인 보유 개수는 2020년부터 지속적으로 확대되는 모습을 보이며 2024년에 가장 큰 폭으로 증가. 이러한 흐름은 미국 내 친 가상자산 환경 형성 등에 힘입어 2025년에도 이어질 것으로 예상. 반면, 국내의 경우 법인의 가상자산 시장 참여가 제한되어 있는 상태. 다만, 지난 2월 금융당국이 글로벌 추세를 고려하여 올해 상반기부터 단계적으로 법인의 가상자산 시장 참여를 허용할 계획이라고 언급. 이에 관련 시장에서는 비트코인 매입 전략을 채택하는 국내 상장 기업 등장 가능성에 주목',
      '▶ 주간 글로벌 ETF 동향\n&nbsp;\n- 지난 주 美 3 대 지수/ETF 는 하락 마감 (SPY -3.1%, QQQ -3.2%, DIA -2.3%, IWM -4.1%). 미국 경기둔화 우려가 지속되는 가운데 트럼프 관세 발 변동성 확대되며 투자심리 약화. 이번 주에는 트럼프의 철강/알루미늄 관세 발효(3/12), 중국의 대미 농축산물 관세 발효(3/10) 등 관세를 둘러싼 노이즈 지속될 전망. 미국-우크라이나 고위급 회담도 예정되어 있어 정치/지정학적 이벤트에 민감한 장세가 연장될 것. 또한, 美 장기물 금리가 단기간 빠르게 하락한 가운데 CPI, 소비심리지수 발표에 주목. CPI 의 경우 헤드라인/근원 모두 전월비 둔화가 예상되고 있지만, 여전히 목표치 대비 높은 수준일 것으로 전망. 이를 감안해 3 월 FOMC 에서는 금리 동결이 유력한 상황이며 CPI 확인 후 시장금리 반응에 주목\n- GICS 기준 헬스케어(XLV +0.2%) 외 전 섹터 하락 마감한 가운데 금융(XLF -5.9%), 경기소비재(XLY -4.8%), 에너지(XLE -3.9%), IT(XLK -3.1%) 등 낙폭 두드러짐. 테마 ETF 중에서는 변동성(VIXY +15.4%), 글로벌 방산(SHLD +9.5%), 천연가스(UNG +9.2%), 유럽 주식(DAX +7.6%, EWG +7.2%, EZU +5.1%, EUFN +4.4%), 중국 IT/플랫폼 (KWEB +6.3%, CQQQ +4.8%), 금/은 채굴(SILJ +6.2%, SILJ +6.2%, GDXJ +6.1%, GDX +4.8%), 구리(CPER +4.2%, COPX +3.7%), 비철금속(DBB +3.6%) 등 강세',
      'Comment\n&nbsp;\n10일(월) 한국 증시는 파월 연준 의장이 경제에 대한 자신감을 표출하면서 미국 경기 불안이 완화된 데다 양회 이후 중국 경기 부양 기대감이 반영되며 2,570대에서 마감(KOSPI +0.27%, KOSDAQ -0.26%). 개인과 기관이 각각 2천86억원, 1천432억원어치를 순매수했고 외국인은 4천362억원의 매도 우위. 다만 외국인은 코스피200 선물시장에서는 2천29억원어치를 순매수. 삼성전자는 장중 강세를 보였으나 장 막판 상승분을 반납. SOil(8.74%), SK이노베이션(6.02%) 등 정유 업종이 실적기대감 속 러시아 정유공장 시설 손상 소식에 오름세. 삼성화재(6.44%), 한화손해보험(3.66%), 한화생명(3.53%) 등 보험 업종도 저평가 매력을 토대로 주가가 동반 상승. 고려아연 경영권을 둘러싼 분쟁이 재점화되면서 고려아연(14.19%), 영풍(8.91%), 영풍정밀(18.17%) 등 관련주가 급등.',
      '관세에 이어 환율, 특히 ‘제2의 플라자합의=마러라고 합의’ 시나리오 부각\n&nbsp;\n우려는 했지만 스물스물 환율 리스크마저 부상하는 분위기다. 아직 일부의 주장이지만 제2의 플라자 합의, 즉 소위 마러라고 합의(Mar-a-Lago Accord) 시나리오가 거론되기 시작했다. 트럼프 2기 행정부가 관세 다음으로 환율 이슈 혹은 통화절상 압력을 ‘MAGA(Make America Great Again)’의 중요 정책 수단으로 사용할 가능성이 제기되었으며 일부 구체화되고 있는 듯한 뉴스가 나오고 있다. &nbsp; 트럼프 행정부 수뇌부는 고평가되어 있다고 생각하는 달러화 지수를 1985년 플라자합의(85년 9월 22일)와 같은 합의, 즉 소위 마러라고 합의로 일컬어지는 합의를 통해 달러화의 고평가 현상을 해소하고자 하는 듯하다. 참고로 1985년 플라자합의란 1985년 9월 22일 미국 뉴욕에 있는 플라자 호텔에서 G5 경제선진국(프랑스, 서독, 일본, 미국, 영국) 재무장관, 중앙은행 총재들의 모임에서 발표된 환율에 관한 합의를 가리킨다. 플라자합의 이후 독일 마르크와 엔화 가치는 2년 동안 약 50% 이상 절상되었고 달러화 실질실효환율지수도 고점대비 약 30% 하락한 바 있다. 물론 트럼프 2기 행정부가 ‘제2의 플라자합의=마러라고 합의’를 원한다고 해도 당장 현실화되기는 어려운 난관이 있다. 과거처럼 외환시장이 정부 통제 하에 있지 않다는 점에서 정부의 의도처럼 인위적으로 강력한 평가절상을 추진하기는 어렵다. 또한 자본 및 외환시장이 완전 개방되어 있다는 점에서 플라자합의와 같은 조치는 급격한 글로벌 자금의 유입 및 유출을 유발시키면서 자칫 통제불가능한 금융위기 혹은 신용이벤트를 초래할 여지가 크다. 미국 입장에서도 달러화 가치가 급격히 하락할 것이 사전에 예고된다면 미국 자산(=달러)에서 급격한 자금이탈로 주식, 채권시장은 물론 주택시장 등 경제 전체가 극심한 후유증을 겪을 가능성을 배제하기 어렵다. 1985년과 달라진 글로벌 금융시장 체제 등을 고려할 때 ‘제2의 플라자합의=마러라고 합의’는 현실성이 낮을 수 있다. 그럼에도 불구하고 ‘제2의 플라자합의=마러라고 합의’ 시나리오가 제기되는 배경에는 트럼프 행정부에서 과거 플라자합의와는 다른 형태의 합의를 구상하고 있는 듯한 분위기 때문이다. 일부의 주장이지만 미국이 100년 무이자 국채를 발행하여 미국 국채를 보유하고 있는 국가들의 미국 국채와 이를 교환하는 방식이다. 100년 동안 무이자로 돈을 차입하겠다는 이 시나리오가 당장 납득하기 어려운 시나리오임은 분명하다. 그러나 트럼프 대통령 시대라는 점에서 가능성을 완전히 무시하기도 어렵다. 고율 관세 및 안보우산을 무기로 무이자 100년 국채를 강매할 수 있고 일부 국가의 경우 이를 쉽게 거부하기 어려울 공산이 크다. 100%는 아니더라도 보유 중인 미 국채를 무이자 100년 국채로 스왑(차환)하는 거래를 받아들일 수도 있을 것이다. 현실화 가능성이 낮다고는 판단하지만 동 시나리오가 일부라도 현실화된다면 미국 재정수지 개선에는 큰 기여를 할 것이다. 동시에 달러화는 약세를 보이겠지만 플라자합의와 같이 큰 폭으로 하락하지는 않을 여지가 있다. 문제는 동 시나리오가 미국의 재정부담을 주요 선진국을 위시해 전세계로 전이시킨다는 의미에서 이를 수용 시 일부 국가의 재정 및 외환건전성이 크게 악화될 여지가 있다. 또한 미국과 첨예한 패권 갈등을 벌이고 있는 중국이 미국측의 ‘제2의 플라자합의=마러라고 합의’ 시나리오를 받아들이지 않을 공산이 크다. 오히려 중국이 보유하고 있는 미국 국채를 대부분 매도하는 전략을 추진하면서 동시에 위안화의 기축통화 전략을 강화시킬 수도 있다.',
      '전일 국내 채권 시장 요약\n- 금리방향: 상승(3Y), 상승(10Y)\n- 일드커브: 스티프닝\n- 스프레드(bp): 국5/3 6.5 (-4.5) 국 10/3: 21.2 (1.5) 국 10/5: 14.7 (6.0) 국30/10: -21.0 (-2.3)',
      '국내 채권시장 동향\n- 국내 채권시장 약세 마감.\n- 미 고용지표가 둔화되었으나 파월의 경기낙관론에 더 큰 이목이 쏠림. 이에 상승한 대외금리를 살피면서 국고채는 약세 출발.\n- 주말 중 대통령, 법원 구속 취소 결정으로 석방. 헌법재판소의 대통령 탄핵 심판을 앞두고 경계 섞인 움직임 지속.\n- 오후 중 국고채 3년 입찰을 소화하며 추가 금리 상승 시현. 해당 입찰은 스플릿이 나타났음.',
      '■ 주요 뉴스: 미국 나스닥지수, &#39;22년 9월 이후 최대폭 하락. 경기침체 우려 등이 반영  \n\r\n   ○ 미국 뉴욕 연은, 1년 후 기대 인플레이션은 전월비 소폭 상승. 관세정책 불안 영향  \n\r\n   ○ ECB 카지미르 위원, 단정적인 금리인하 시각 경계. 유로존 3월 투자자신뢰는 개선  \n\r\n   ○ 중국, 예고대로 미국産 농산물에 보복관세. 미국과의 정상회담 가능성도 제기\n\r\n   \n\r\n■ 국제금융시장: 미국은 경기침체 우려, 트럼프 정책 불확실성 등으로 위험자산 선호 약화\n\r\n                주가 하락[-2.7%], 달러화 강세[+0.1%], 금리 하락[-9bp] \n\r\n   ○ 주가: 미국 S&P500지수는 경기침체도 배제하지 않겠다는 트럼프의 발언 등으로 큰 폭 하락\n\r\n            유로 Stoxx600지수는 미국 증시 영향 등으로 1.3% 하락\n\r\n   ○ 환율: 달러화지수는 경기침체 우려 불구 인플레이션 재반등 가능성 등으로 소폭 상승\n\r\n            유로화 가치는 강보합, 엔화 가치는 0.5% 상승\n\r\n   ○ 금리: 미국 10년물 국채금리는 안전자산 선호 강화, 금리인하 기대 증가 등이 원인\n\r\n            독일은 재정준칙 수정에 대한 일부 야당의 반대, 차익매물 출회 등으로 약보합\n\r\n       ※ 뉴욕 1M NDF 종가 1457.2원(스왑포인트 감안 시 1460.0원, 0.30% 상승). 한국 CDS 강보합',
    ];

    const contents = ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{ECONOMIC_INFORMATION}}',
      JSON.stringify(infos),
    );

    const response = await geminiService.invoke({ contents });
    console.log(response);
  });
});
