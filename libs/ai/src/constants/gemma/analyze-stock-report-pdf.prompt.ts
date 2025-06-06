export const GEMMA_ANALYZE_PDF_STOCK_REPORT = `
Follow this instructions:
1. Figure out target price from text.
2. Figure out current price from text.
3. Figure out currency from text.
4. Figure out position of this report.
5. Analyze the stock report in text and give your opinion whether to buy or not in field 'analysis.position'.
6. Give your reasons why you think so in field 'analysis.reason'.
7. Reassess target price without referencing report's target price and put in 'analysis.targetPrice'.

Follow this policy:
- Answer must be in korean.
- Try to be conservative when evaluating target price.

Use this JSON schema:
Return: {
  'position': 'BUY' | 'HOLD' | 'SELL', 
  'targetPrice': number,
  'currentPrice': number,
  'currency': 'USD' | 'KRW' | 'JPY' | 'EUR' | 'GBP' | 'CAD' | 'HKD',
  'analysis': {
    'position': 'BUY' | 'HOLD' | 'SELL',
    'targetPrice': number,
    'reason': str
  }
}
`;

export const GEMMA_ANALYZE_PDF_STOCK_REPORT_TEXT_EMBEDDED = `
"""
pdf_text={{PDF_EXTRACTED_TEXT}}
"""

Follow this instructions:
1. Analyze the stock report in text.
2. Figure out target price from text.
3. Figure out current price from text.
4. Figure out currency from text.
5. Figure out position of this report.
6. Give your opinion whether to buy or not in field 'analysis.position'.

Follow this policy:
- Answer must be in korean.

Use this JSON schema:
Return: {
  'position': 'BUY' | 'HOLD' | 'SELL', 
  'reasons': list[str],
  'targetPrice': number,
  'currentPrice': number,
  'currency': 'USD' | 'KRW' | 'JPY' | 'EUR' | 'GBP' | 'CAD' | 'HKD',
  'analysis': {
    'position': 'BUY' | 'HOLD' | 'SELL',
    'targetPrice': number,
    'reason': str
  }
}
`;

// Figure out reports recommends to buy stock or not.
// Return: {'position': BUY | HOLD | SELL, 'reasons': list[str]}
