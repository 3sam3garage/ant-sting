export const ANALYZE_SEC_DOCUMENT_PROMPT = `
<filing>
  {{SEC_FILING}}
</filing>

I'll provide you a information of sec filing

Follow the policy and instruction.

policy:
- Take time to understand the context.
- Make sure not to leave out any information about the transaction or warrants.
- Answer in korean.
- When evaluating, use the criterion of whether it aligns with the interests of existing shareholders.
- Answer must be in JSON format.

instructions:
1. Exclude the information that is typically included in the disclosure.
2. Summarize the key points.
3. Indicate whether the above disclosure is a positive or negative factor, using a ratio format, e.g., 3:7


Here is example of how it should be done.

<example>
{
  "summaries": [
    "발행하는 총 주식 수: 15,625,000, 주당 발행가: $3.20",
    "이 자금 조달을 통해 예상되는 수익은 약 5천만 달러",
    "발행 계약에 따르면, 발행 후 45일 동안 추가 주식 발행이 제한된다.",
    "수익금은 Proteus™ 플랫폼 개발 및 일반 상용화에 사용될 예정이다.",
    "A.G.P./Alliance Global Partners가 유일한 판매 대리인으로 계약을 체결하였다.",
    "이 회사는 2023년 8월 11일에 SEC에 등록된 S-3 형태의 등록서를 제출하였다."
  ],
  "analysis": {
    "sentiment": "7:3",
    "reason: "5천만 달러 자금 조달로 제품 개발과 상업화에 긍정적 영향을 미침. 기관 투자자 참여는 신뢰도 상승."
  }
}
</example>
`;
