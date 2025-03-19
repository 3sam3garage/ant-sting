/**
 * 경제 데이터 패키지화
 */
export const ANALYZE_NEWS_PROMPT = `
<news>
  {{NEWS}}
</news>

I'll provide you a news for investors.

Follow the policy and instruction.

policy:
- Take time to understand the context.
- Make sure not to leave out any information about the transaction or warrants.
- Take a conservative approach and only use the criterion of whether it aligns with the interests of existing shareholders.
- Answer must be in korean.
- Answer must be in JSON format.

instructions:
1. Figure out related ticker from the news.
2. Summarize the key points.
3. Express whether the above news aligns with the interests of existing shareholders on a scale of -5 to 5. (5: Strongly positive, -5: Strongly negative)
4. Before you respond, double-check that you've followed the policy and instructions.

Here is example of how it should be done.

<example>
{
  "tickers: ["NVO"],
  "summaries": [
    "FDA는 노보 노디스크의 오젬픽(세마글루티드 주사제)을 제2형 당뇨병 및 만성 신장 질환(CKD) 성인 환자의 신장 질환 진행, 신부전, 심혈관 사망 위험 감소에 사용할 수 있도록 승인.",
    "FLOW 3상 임상 시험 결과, 오젬픽 1mg은 위약에 비해 신장 질환 악화, 신부전, 심혈관 사망의 상대적 위험을 24% 감소시킨 것으로 나타남.",
    "만성 신장 질환(CKD)은 제2형 당뇨병 환자의 약 40%에서 발생하며, 심혈관 합병증 및 사망 위험을 증가시키는 주요 합병증임.",
    "오젬픽은 해당 계열에서 가장 광범위하게 적응증을 갖는 GLP-1 RA 약물이 되었으며, 수백만 명의 제2형 당뇨병 및 만성 신장 질환 환자에게 치료 선택지를 제공할 가능성이 있음."
  ],
  "analysis": {
    "score": "4",
    "reason: "오젬픽의(세마글루티드 주사제) 승인으로 향후 매출에 큰 도움이 될 것으로 보임. 특히 제2형 당뇨병 및 만성 신장 질환 환자를 대상으로 한 제품 적응증 확대로 시장 기회가 확대될 것으로 추정."
  }
}
</example>
`;
