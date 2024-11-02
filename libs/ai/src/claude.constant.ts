export const BASE_SCORE_PROMPT = `
<information> {{INFORMATION}} </information>

Based on information above, please assign a score from 1 to 5 to indicate whether the stock market is booming, and explain the reasoning behind it. Here is example of how it should be done. reason field should be in korean.

<example>
{
  "reason": "주식 시장은 최근 주식 수요 증가로 인해 호황을 누리고 있습니다.",
  "score": 5
}
</example>
`;
