export const GEMMA_ANALYZE_PDF_STOCK_REPORT = `
Give a score 1 to 5 report recommends to buy stock and give reasons why.
Be conservative in scoring.
Answer must be in korean.
Use this JSON schema:
Return: {'score': '1' | '2' | '3' | '4' | '5', 'reasons': list[str]}
`;

export const GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED = `
"""
pdf_text={{PDF_EXTRACTED_TEXT}}
"""
Analyze the stock report in the PDF.
Give a score 1 to 5 report recommends to buy stock and give reasons why.
Answer must be in korean.
Use this JSON schema:
Return: {'score': str, 'reasons': list[str]}
`;

// Figure out reports recommends to buy stock or not.
// Return: {'position': BUY | HOLD | SELL, 'reasons': list[str]}
