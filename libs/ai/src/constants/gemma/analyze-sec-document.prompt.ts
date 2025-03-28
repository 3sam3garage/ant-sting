export const ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT = `
"""
text={{SEC_FILING}}
"""

1. Analyze the information provided above.
2. Summarize the key points.
3. Assess whether the above filing aligns with the interests of existing shareholders on a scale of -5 to 5. (5: Strongly positive, -5: Strongly negative, 0: Neutral).

Be conservative in your analysis.
Answer must be in korean.
Use this JSON schema:
Return: {'score': number, 'summaries': list[str], 'reason': str }
`;

/**
 * @deprecated
 * 이미지 파싱이 답없기도하고. 너무 요청이 무거워질듯
 */
export const ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT_IN_IMAGE = `
1. Analyze the information provided above.
2. Summarize the key points.
3. Express whether the above filing aligns with the interests of existing shareholders on a scale of -5 to 5. (5: Strongly positive, -5: Strongly negative).

Answer must be in korean.

Use this JSON schema:
Return: {'score': str, 'summaries': list[str], 'reason': str }

example:
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
    "score": "3",
    "reason: "5천만 달러 자금 조달로 제품 개발과 상업화에 긍정적 영향을 미침. 기관 투자자 참여는 신뢰도 상승."
  }
}
`;
