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

/**
 * @deprecated
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
