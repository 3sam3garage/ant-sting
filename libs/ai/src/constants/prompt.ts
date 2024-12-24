/**
 * 경제 데이터 패키지화
 */
export const ANALYZE_ECONOMIC_INFORMATION_PROMPT = `
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
 * 리포트 정보 & 재무제표 정보를 넘겨서 예상 주가 및 분석 리포트를 작성
 */
export const ANALYZE_STOCK_REPORT_PROMPT = `
<information>
  <price>{{CURRENT_PRICE}}</price>
  <report-summary>{{REPORT_SUMMARY}}</report-summary>
  <financial-statement>
    <cash-flow>{{CASH_FLOW}}</cash-flow>
    <profit-and-loss>{{PROFIT_AND_LOSS}}</profit-and-loss>
    <balance-sheet>{{BALANCE_SHEET}}</balance-sheet>  
  </financial-statement>
</information>

I'll provide you with the current stock price, a summary of the analyst report, and financial statement information.
Based on the information, please provide a analysis of the company's financial statement.
Follow the policy and instruction.

policy:
- Try not to use exact number but use percentage or trend.
- Take time to understand the context. 
- Consider whether this information could be helpful for investment before summarizing it.
- Answer in korean.

instructions:
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

3. Give expectation how the stock price will change in next 6 months. Try to be conservative when assessing.
  3.1. Provide a target price which will be the price you think the stock price will be in next 6 months. either up or down.
  3.2. Provide a position(BUY, SELL, HOLD) based on the information. If you recommend to buy the stock, rate BUY, if you recommend to sell the stock, rate SELL, if you're not sure, rate HOLD.
  3.3. Give score 1 to 5 how much would you recommend this stock.
  3.4. Provide a reason why you rated 'position' and 'score'.

Here is example of how it should be done. 

<example>
{
  "analysis: {
    "targetPrice": 20000,
    "position: "BUY",
    "score": 3,
    "reason: "꾸준한 매출과 순이익 증가로 보아 시장 개척 및 신규 사업에 대한 투자가 효과적으로 이루어지고 있음을 추정. 점진적으로 부채비율 개선이 이루어지고 있으며, 안정적인 재무구조 유지 가능성이 높음."
  },
  "revenue": "2015년 이후 꾸준히 10% 이상 증가 추세, 2020년 20% 이상 증가, 평균 10% 성장",
  "netIncome": "평균 15% 이상 순이익율. 매출 상승분과 정비례하지는 않지만, 비슷한 흐름으로 성장 추세",
  "totalAssets": "단기적인 부채 증가로 인한 총자산 감소. (-2%)",
  "debtRatio": "2015년 50% 이상 부채비율, 2020년 40% 이하로 감소",
  "equity": "2015년 이후 꾸준히 증가 추세",
  "currentRatio": "유동부채 감소로 단기상황지급능력 상승",    
  "returnOnEquity": "2015년 50% 이상 부채비율, 2020년 40% 이하로 감소",
  "returnOnAssets": "2015년 15%, 2016년 16%, 2017년 17%, 2018년 18%, 2019년 19%, 2020년 20% 로 꾸준히 상승",
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

export const ANALYZE_PDF_STOCK_REPORT_PROMPT = `
<information>
  <current_date>{{TODAY}}</current_date>
  <text>
    {{PDF_EXTRACTED_TEXT}}
  </text>
</information>

I'll give you text of stock report which is extracted from pdf file.
Follow the policy and instruction.

policy:
- Try not to use exact number but use percentage or trend.
- Take time to understand the context. 
- Consider whether this information could be helpful for investment before summarizing it.
- Answer in korean.

instructions:
1. Figure out what company is up to and what they are expecting.
2. base on current_date, distinguish expectation and past data from text.
3. figure out target price from text. (Do not display the currency, just leave the numbers.)
4. figure out current price from text. (Do not display the currency, just leave the numbers.)
5. figure currency from text (USD, HKD, CAD, EUR, GBP, KRW, JPY)
6. figure out position from text. (BUY, SELL, HOLD)
7. Give your opinion whether to buy or not in field 'analysis.position' (BUY, SELL, HOLD)
8. Base on information above, assess this stock's target price in 6 months.
9. Give reason why you assessed that way in instruction 7-8. 

<example>
{
  "expectation": ["25 년 매출액 1,239 억원(YoY +77.1%), 영업이익 130 억원(YoY +95.4%, OPM10.5%)을 전망"],
  "past": [
    "PECVD 및 드라이클리닝 장비 외 BSD(BacksideDeposition), Low-K PECVD 장비를 개발 중. 두 신규 장비 모두 외산 장비 대체이며, 고객사 퀄은 이미 마무리, 내년부터 본격적인 매출 기여가 가능할 것으로 판단",
    "삼성전자는 DDR5 전환 및 레거시 디램 노출도 축소 목적,SK하이닉스는 HBM 생산 확대를 위한 목적. 이 과정에서 동사의 디램수주 규모도 올해 대비 증가함에 따라 매출액 2,662억원(+22% YoY),영업이익 411억원(+93% YoY)으로 성장 전망"
    "디램에서 증가하고 있는 수주액을 고려하면 인식 전환 필요. 현 주가는 내년 실적 기준 P/E 8.X 수준으로 바닥권에 형성되어 있어 부담없는 수준",
    "최근 3년간 영업이익(YoY) 꾸준히 10% 성장",
    "3Q2024 영업이익 87억달러(+2.1%), 순이익 61억달러(+3.7%)"
  ],
  "targetPrice": 100.2,
  "currentPrice": 88,
  "currency": "USD",
  "position": "BUY",
  "analysis": {
    "position": "HOLD",
    "targetPrice": 97",
    "reason: "단기적으로는 주가 하방압력이 있지만, 4Q23 실적과 당분기 자사주 매입·소각으로 향후 주가 상승 예상."
  }  
}
</example>
`;
