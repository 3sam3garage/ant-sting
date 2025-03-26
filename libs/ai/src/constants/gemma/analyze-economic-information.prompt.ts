/**
 * 경제 데이터 패키지화
 */
export const ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT = `
"""
text={{ECONOMIC_INFORMATION}}
"""

1. Analyze the information provided above.
2. Combine provided information and Give 5 to 10 brief summaries.
3. Provide 3 to 5 insights that can aid market strategy.
4. Provide 1 to 3 questions which might rise from information and give answer for that.
5. Provide 2 to 5 strategies that can effectively respond to market condition. actions can be same, but it must have different reason.
6. Explain any difficult terms or terms that require historical context in your response from 'step 1 to 5'. If no additional explanation is needed, feel free to skip it.

- Answer must be in korean.

Use this JSON schema:
Question = { 'question': str, 'answer': str }
Strategy = { 'action': str, 'reason': str }
Return: {'summaries': list[str], 'insights': list[str], 'questions': list[Question] 'strategies': list[Strategy], 'terminologies': list[str] }
`;
