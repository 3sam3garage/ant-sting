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
  "reason": "주식 시장은 최근 주식 수요 증가로 인해 호황을 누리고 있습니다.",
  "score": 5
}
</example>
`;

/**
 * 글로벌 주식 시장, 경제, 채권에 대한 정보를 건네주면, 이 정보를 결합하고 3개의 간단한 요약을 추출해줘.
 */
export const COMBINE_AND_EXTRACT_KEYWORDS_PROMPT = `
<information>
  <debenture>{{DEBENTURE}}</debenture>
  <economy>{{ECONOMY}}</economy>
  <invest>{{INVEST}}</invest>
  <marketInfo>{{MARKET_INFO}}</marketInfo>
</information>
  
I'll give you a information of global stock market, economy, debenture and investing.
Combine information I provide and extract 5 brief summaries.
Here is example of how it should be done. 
  
<example>
{ 
  "summaries": [
    "코스피의 단기 급락이 아닌 점전직인 하락장 전개", 
    "트럼프발 강달러 지속", 
    "Red Sweep과 함께 다가오는 고금리, 강달러 공포.",
    "주춤했던 미국의 인플레이션 둔화 추세 재개",
    "원달러 환율 1400원 뉴노멀 가능성"
  ] 
}
</example>
`;

export const RECOMMEND_PORTFOLIO = `
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
    "채권": "15%",
    "예금": "15%",
    "부동산" : "40",
    "주식": "15%"
  },
  "reasons": [
    "트럼프 대통령 당선으로 인해 비트코인 상방 열림",
    "금리인하 기대감으로 주식 시장 기대, 채권 시장 냉각",
    "은행 대출 규제로 부동산 거래 급감"
  ] 
}
</example>
`;
