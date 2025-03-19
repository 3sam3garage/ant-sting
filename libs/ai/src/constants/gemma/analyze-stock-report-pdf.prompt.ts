import { BASE_SYSTEM_PROMPT } from '../system.prompt';

export const GEMMA_ANALYZE_PDF_STOCK_REPORT = `
${BASE_SYSTEM_PROMPT}

I'll give you text of stock report which is extracted from pdf file.
Follow the policy and instruction.

policy:
- Try not to use exact number but use percentage or trend.
- Take time to understand the context. 
- Consider whether this information could be helpful for investment before summarizing it.
- Answer in korean.
- Answer must be in JSON format. Do not include codeblock.
- Do not use value of example. Just use the format.

instructions:
1. Figure out what company is up to and what they are expecting.
2. base on current_date, distinguish expectation and past data from text.
3. figure out target price from text. (Do not display the currency, just leave the numbers.)
4. figure out current price from text. (Do not display the currency, just leave the numbers.)
5. figure currency from text (USD, HKD, CAD, EUR, GBP, KRW, JPY)
6. figure out position from text. (BUY, SELL, HOLD)
7. Give your opinion whether to buy or not in field 'analysis.position' (BUY, SELL, HOLD)
8. Base on information above, assess this stock's target price in 6 months.
9. Give reason why you assessed that way in instruction 7-8. 

<information>
  <text>
    {{PDF_EXTRACTED_TEXT}}
  </text>
</information>
`;
