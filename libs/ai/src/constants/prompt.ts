/**
 * 경제 데이터 패키지화
 */
export const PACKAGE_ECONOMIC_INFORMATION_PROMPT = `
<information>
  {{INFORMATION}}
</information>
  
I'll give you a information of global stock market, economy, debenture and investing.
Here are 5 things you need to do.
1. Combine information I provide and extract into 5 to 10 brief summaries.
2. Provide 2 to 5 strategies that can effectively respond to market condition. actions can be same, but it must have different reason.
3. Provide 3 to 5 insights from those summary.
4. Provide 1 to 3 questions from information and give answer for that.
5. Please explain any difficult terms or terms that require historical context in your response from 'step 1 to 5'. If no additional explanation is needed, feel free to skip it.
Here is example of how it should be done. 
  
<example>
{ 
  "summaries": [
    "코스피의 단기 급락이 아닌 점전직인 하락장 전개", 
    "트럼프발 강달러 지속", 
    "Red Sweep과 함께 다가오는 고금리, 강달러 공포.",
    "주춤했던 미국의 인플레이션 둔화 추세 재개",
    "원달러 환율 1400원 뉴노멀 가능성"
  ],
  "insights": [
    "금리 인하 지연 가능성으로 인한 미국 국채 및 달러 강세 예상",
    "글로벌 불확실성 증가로 인한 안전자산 선호로 금에 대한 수요 증가"
  ],
  "strategies": [
    {
      "action": "미국 에너지 관련 ETF 투자(10%)",
      "reason":"미국의 에너지 정책 변화 가능성으로 인한 에너지 섹터 관심 증가"
    },
    {
      "action": "미국 주식 비중을 줄이고 미국 국채 비중 늘리기(10% -> 20%)",
      "reason": "금리 인하 지연 가능성으로 인한 미국 국채 및 달러 강세 예상",
    },
    {
      "action": "비트코인 투자(5% -> 5%)",
      "reason": "트럼프 대통령 당선으로 인해 비트코인 상방이 열렸다는 평가가 있으나, 1만달러 돌파 후 조정 가능성 높음.",
    },
    {
      "action": "원화자산 비중 DOWN(25% -> 15%)",
      "reason": "원화 약세 지속 가능성으로 인한 자산 다변화 필요. 엔화 또는 달러 자산으로 이동.",
    },
    {
      action: '기술주 투자 비중 유지 (15%)',
      reason: 'AI 및 반도체 산업의 장기적 성장 잠재력 유지, 단기 변동성에 대비'
    }
  ],
  "questions": [
    {
      "question": "중국의 경제 회복이 경제 시장에 미치는 영향은 무엇인가?",
      "answer": "강달러와 중국의 수요 우려로 비철금속과 귀금속 가격이 하락세를 이어가고 있으며, 특히 구리 가격은 단기적으로 $8,500로 하락할 것으로 전망됨."
    },
    {
      "question": "CPI 상승이 소비자에게 미치는 영향은 무엇인가?",
      "answer": "구매력 감소. 소비 패턴 변화. 금리 인상 가능성. 저축 및 투자에 대한 영향"
    },
    {
      "question": "현재 시장의 상황을 고려한 효과적인 투자 전략은 무엇인가?",
      "answer": "포트폴리오 재조정(방어적인 섹터나 현금으로 자산 배분을 전환하여 투기적 자산에 대한 노출 감소.) 레버리지 제한: 과도한 마진 사용을 피하여 강제 매도 리스크를 최소화."
    }
  ],
  "terminologies": [
    "Red Sweep: "미국 공화당이 주 또는 연방 선거에서 크게 이겨 다수의 자리를 차지함."
    "뉴노멀(New-normal): 일반적으로 사회, 경제, 기술 등 여러 분야에서 변화된 상황이나 새로운 기준을 뜻함.",
    "PPI (Producer Price Index): 생산자물가지수로, 기업 간 거래되는 상품과 서비스의 가격 변동을 측정하는 지표"
  ]
}
</example>
`;

/**
 * 개별 주식의 리포트 요약 정보를 건네 주면, 이 정보가 주식에 얼마나 호재일지에 대한 점수를 1 ~ 5점으로 표시하고 그 이유를 설명해줘.
 * 아래 예제를 참고해서 작성해줘.
 * 이유는 한국어로 작성해야 해.
 */
export const BASE_SCORE_PROMPT = `
<information> {{INFORMATION}} </information>

I'll give you a report summary of a individual stock.
Based on the information, please assign a score from 1 to 5 how favorable this is information is and explain the reasoning behind it. 
Here is example of how it should be done. 
reason field should be in korean.

<example>
{
  "reason": "4Q 어닝쇼크, 전년 대비 영업이익 80% 상승. 원달러 환율 1400원대로 수출량 상승 여력 충분.",
  "score": 5
}
</example>
`;

/**
 * @deprecated
 */
export const RECOMMEND_PORTFOLIO_PROMPT = `
<information>
  <debenture>{{DEBENTURE}}</debenture>
  <economy>{{ECONOMY}}</economy>
  <invest>{{INVEST}}</invest>
  <marketInfo>{{MARKET_INFO}}</marketInfo>
</information>
  

I'll give you a information of global financial market.
Combine information I provide and make invest portfolio that may possibly yield highest profit. 
Here is example of how it should be done. 

<example>
{ 
  "portfolio": {
    "금": "10%",
    "비트코인": "5%",
    "미국 채권": "10%",
    "한국 채권": "10%",
    "원화": "15%",
    "엔화": "10%",
    "부동산" : "20",
    "미국 방산주": "5%",
    "미국 원자력 관련주": "10%",
    "한국 건설주": "5%",
  },
  "reasons": [
    "트럼프 대통령 당선으로 인해 비트코인 상방 열림",
    "금리인하 기대감으로 주식 시장 기대, 채권 시장 냉각",
    "은행 대출 규제로 부동산 거래 급감"
  ] 
}
</example>
`;

export const ANALYZE_PORTFOLIO_PROMPT = `
<information>
  <cash-flow>{{CASH_FLOW}}</cash-flow>
  <profit-and-loss>{{PROFIT_AND_LOSS}}</profit-and-loss>
  <balance-sheet>{{BALANCE_SHEET}}</balance-sheet>
</information>

I'll give you a information of financial statement of a company.
Based on the information, please provide a analysis of the company's financial statement.
Try not to use exact number but use percentage or trend.
Here are steps you should take.

1. Provide a brief summary of the financial statement.
When analyzing fields down below must be included.
- Revenue 
- Net Income 
- Total Assets 
- Debt Ratio 
- Equity 
- Current Ratio 
- Return on Equity 
- Return on Assets

2. Provide 3 to 5 insights from information.

Here is example of how it should be done. 

<example>
{
  "revenue": "2015년 이후 꾸준히 10% 이상 증가 추세, 2020년 20% 이상 증가, 평균 10% 성장",
  "net-income": "평균 15% 이상 순이익율. 매출 상승분과 정비례하지는 않지만, 비슷한 흐름으로 성장 추세",
  "total-assets": "단기적인 부채 증가로 인한 총자산 감소. (-2%)",
  "debt-ratio": "2015년 50% 이상 부채비율, 2020년 40% 이하로 감소",
  "equity": "2015년 이후 꾸준히 증가 추세",
  "current-ratio": "유동부채 감소로 단기상황지급능력 상승",    
  "return-on-equity": "2015년 50% 이상 부채비율, 2020년 40% 이하로 감소",
  "return-on-assets": "2015년 15%, 2016년 16%, 2017년 17%, 2018년 18%, 2019년 19%, 2020년 20% 로 꾸준히 상승",
  "insights": [
    "매출과 순이익의 급격한 성장은 회사의 핵심 사업 분야에서의 경쟁력 강화와 시장 점유율 확대를 시사함",
    "부채비율 감소로 안정적인 재무구조 유지 가능성.",
    "꾸준한 매출 및 순이익 증가가 배당성향 증가로 이어지지 않음. (평균 배당률 4%)",
    "매출과 순이익의 꾸준한 성장에도 불구하고 ROE와 ROA의 개선 속도가 상대적으로 더딘 것은 자산 효율성 측면에서 개선의 여지가 있음을 시사",
    "꾸준한 매출과 순이익 증가로 보아 시장 개척 및 신규 사업에 대한 투자가 효과적으로 이루어지고 있음을 추정"
  ]
}
</example>
`;
