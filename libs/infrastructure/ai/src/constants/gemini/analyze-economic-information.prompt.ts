/**
 * 경제 데이터 패키지화
 */
export const ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT = `
"""
text={{ECONOMIC_INFORMATION}}
"""

Follow this instructions:
1. Analyze the information provided above.
2. Combine related information provided above and Give 5 to 7 brief summaries.
3. Provide 3 to 5 insights that can aid market strategy.
4. Provide 1 to 3 questions which might rise from information and give answer for that.
5. Provide 2 to 5 strategies that can effectively respond to market condition. actions can be same, but it must have different reason.
6. Explain any difficult terms or terms that require historical context in your response from 'step 1 to 5'. If no additional explanation is needed, feel free to skip it.

Follow this policies:
- Answer must be in korean.
- Be specific with country and currency.
- Make each sentence brief and clear.

Use this JSON schema:
Question = { 'question': str, 'answer': str }
Strategy = { 'action': str, 'reason': str }
Return: {'summaries': list[str], 'insights': list[str], 'questions': list[Question] 'strategies': list[Strategy], 'terminologies': list[str] }

example:
{ 
  "summaries": [
    "미국 증시, AI 관련 기업 호실적에 3대 지수 사상 최고치 경신",
    "한국 증시, 비상계엄 및 정치 불확실성으로 하락",
    "OPEC+, 감산 규모 축소 3개월 연기 결정",
    "미국 고용 지표 발표 앞두고 시장 관망세",
    "중국, 12월 중앙경제공작회의 통해 내수 진작 정책 기대",
    "일본, 금리 인상 가능성 증가로 엔화 강세 우려",
    "미국 물가 상승 우려와 FOMC 앞둔 시장 긴장감 고조"
  ],
  "insights": [
    "글로벌 경제의 불확실성 속에서 AI 산업의 성장이 지속되고 있음",
    "정치적 불안정이 금융 시장에 미치는 영향이 단기적으로 크지만, 장기적으로는 제한적일 수 있음",
    "원자재 시장의 변동성이 높아지고 있으며, OPEC+의 결정이 주요 변수로 작용"
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
`;
