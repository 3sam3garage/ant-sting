import {
  BedrockRuntimeClient,
  ConverseCommand,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from '@aws-sdk/client-bedrock';
import { COMBINE_AND_EXTRACT_KEYWORDS_PROMPT } from '@libs/ai/claude.constant';

describe('aws claude', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;
  let bedrockClient: BedrockClient;

  beforeEach(() => {
    client = new BedrockRuntimeClient({ region: 'us-east-1' });
    bedrockClient = new BedrockClient();
  });

  it('get foundation model list', async () => {
    const command = new ListFoundationModelsCommand({});
    const res = await bedrockClient.send(command);

    const models = res?.modelSummaries || [];

    for (const model of models) {
      console.log(model.modelArn);
    }

    console.log(1);
  });

  it('converse request', async () => {
    const query =
      'describe most important feature in korea stock market. answer in korean';
    const conversation = [
      { role: 'user', content: [{ text: query }] },
    ] as never;

    // Create a command with the model ID, the message, and a basic configuration.
    const command = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    });

    const res = await client.send(command);
    const contents = res.output.message.content;

    console.log(contents);
  });

  it('invoke request', async () => {
    const query =
      'describe most important feature in korea stock market. answer in korean. answer in json format. feature field is required.';
    const client = new BedrockRuntimeClient({ region: 'us-east-1' });

    // Prepare the payload for the model.
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: query }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(payload),
      modelId,
    });
    const apiResponse = await client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);

    const json = JSON.parse('{' + responseBody.content[0].text);

    return json;
  });

  it('keyword extraction', async () => {
    const query = COMBINE_AND_EXTRACT_KEYWORDS_PROMPT.replace(
      '{{INFORMATION}}',
      `KOSPI는 1.4% 하락한 2,449p. 트럼프발 고금리, 강달러 지속되며 8월 블랙먼데이 수준 밸류에이션 도달


- 미국 주식시장은 연은 위원 매파적 발언에 10년물 국채금리 4.4% 상회. 반도체 중심 차익실현 지속
- 닐 카시카리 미니애 연은 총재, 12월 FOMC 금리 동결 가능 시사. 금주 발표될 10월 소비자물가 예의주시
- 페드워치 기준 12월 금리 동결 확률 41.3%까지 상승(한달전→1주전, 15%→22%)하며 국채금리 상승 야기
- 트럼프발 강달러 지속. 달러인덱스 106p 돌파. 다만 테슬라는 별다른 이슈 부재한 가운데 차익실현(-6.2%)
-  KOSPI는 2,450p선 까지 하락. 뚜렷한 상승동력 부재한 가운데 고금리, 강달러 영향에 고통받는 시장
- 외국인 오전 현물 2,890억 순매도. 선물은 3거래일만 순매수나 소규모. 원/달러 환율 장중 1,410원 도달
- 8/5일 종가 기준 KOSPI 12개월 후행 PBR 0.88배, 12개월 선행 PER 8.17배(LSEG 기준)
- 금일 장중 도달한 2,450p 기준 KOSPI 12개월 후행 PBR 0.89배, 12개월 선행 PER 8.39배(LSEG 기준)
- 삼성전자, 오늘도 52주 신저가 경신. 장중 5만 천원대 진입. 다만 오전 외국인은 11거래일만 순매수 전환
- 삼성전자 전일 종가 기준 12개월 선행 PBR 0.88배. 외국인 저가매수 장마감까지 지속될지 확인 필요
- 트럼프 수혜 업종서 언급안된 은둔고수 엔터 오늘도 강세. 25년 호실적 기대(문화 수출엔 관세장벽이 없다)
- 로제 아파트, 미 빌보드 핫100 15위, 글로벌 3주째 1위 소식도 미디어/엔터 업종 저가매수세 유입 요인
- KOSPI 52주 신저가 종목만 189개. 어떤 업종, 종목이 내리는지 다 설명하기도 어려운 시장
- Red Sweep과 함께 다가오는 고금리, 강달러 공포. 외국인 자금 이탈 지속되며 대형주 위주 매도우위 지속
- 카시카리가 언급했듯 12월 FOMC 금리 인하폭 결정지을 지표(CPI, 동행지표)에 따른 위험자산 등락 주목



- 12일(화) 코스피는 지난 8월 블랙먼데이 이후 처음으로 2,500선 내주며 하락 마감(KOSPI -1.94%, KOSDAQ -2.51%). 도널드 트럼프 대통령 당선 이후 보호무역주의 심화, 인플레이션 상승 우려에 더해 간밤 미국 증시 내 주요 반도체주 급락에 국내 반도체주가 동반 약세를 보이며 코스피 하락. 수출 및 이익 추정 하향이 지속되면서 한국 증시의 투자 매력에 대한 의문도 존재. 이날 유가증권시장에서 거래된 944개 종목 중 84%에 해당하는 791개 종목이 약세를 보였으며 194개 종목이 52주 신저가를 기록. 삼성전자(-3.64%)가 5만3천원까지 내리며 4년 4개월 만에 최저가를 기록했으며 SK하이닉스(-3.53%)는 7거래일 만에 '18만닉스'로 하락. 트럼프 수혜주는 업종별 차별화 양상. 한화오션(-1.34%) 등 조선주도 하락. 반면 한화시스템(+3.24%) 등 방산주가 52주 신고가 재차 경신했으며 비트코인 급등에 한화투자증권(+0.96%) 등 가상화폐 관련주도 상승.

- 기업부채 레버리지 비율이 가파르게 높아진 가운데 누적된 기업대출의 질이 지속해서 떨어지고 금융사 자금 중개 기능의 효율성과 거시건전성 지표도 악화할 수있다는 우려
- 기업부채 확대 과정의 가장 큰 특징은 다른 주요국들에 비해 증가 속도가 빨랐다는 점과 부동산시장 활황과 밀접하게 관련돼 있다는 점
- 금융연구원은 추가 건전성 지표 악화 가능성에 대비하고 금융 자금 중개기능을 강화하기 위해 금융사는 물론 정부의 질적 개선 노력이 필요하다고 조언

- 11/12(현지시간) KOSPI는 전일대비 2% 가량 하락하며 2,482.57pt 기록. 지난 8/5(현지시간)‘블랙먼데이’ 이후 2,500선이 재차 붕괴  
- 국내 펀더멘탈 부진과 트럼프 관세정책 우려 잔존 속 원/달러 환율이 2년래 최고치 기록하며 외인&기관의 자금 이탈 지속된 것이 주 요인 
- 코스피는 직전 저점 수준(8/5 종가 2,441.55pt)에 도달했으나 향후 반등 강도와 지수 향방은 이전과 상이할 전망 
- 시장 하락의 주 요인과 연출 상황이 다르기 때문(지난 8월 코스피는 ‘블랙먼데이’ 이후 2주내 낙폭을 모두 되돌리며 반등에 성공) 
- 지난 8월 초 코스피 급락은 미 고용 쇼크(美 실업률 6월 4.1% → 7월 4.3%)로 인한 경기침체 공포와 엔캐리 트레이드 청산 우려가 배경  
- 여기에 AI 버블 붕괴 우려까지 부각되며 미 증시는 기술주 중심으로 하락. 미국발 쇼크로 5일 KOSPI는 8% 이상 급락, 서킷브레이커 발동됨 
- 금번 사례는 코스피의 단기 급락이 아닌 점전직인 하락장 전개. 하락 요인도 상대적 펀더멘탈 부진에 따른 韓 증시 디메리트 심화에 기인
`,
    );
    const client = new BedrockRuntimeClient({ region: 'us-east-1' });

    // Prepare the payload for the model.
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      system: 'You are a veteran financial planner and analyst.',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: query }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(payload),
      modelId,
    });
    const apiResponse = await client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);

    const json = JSON.parse('{' + responseBody.content[0].text);

    return json;
  });
});
