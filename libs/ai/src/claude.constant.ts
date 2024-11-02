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
