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
`;
