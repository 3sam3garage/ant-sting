import { today } from '@libs/common';

export const TEST_PROMPT = `
<dirty_text>
  {{DIRTY_TEXT}}
</dirty_text>


I'll give you text of stock report which is extracted from pdf file.
Today is ${today()}.
If you found data past this date, add to expectation.
If you found data from financial statement table before this date, add to financialStatement field.

Try not to use exact number but use percentage or trend.

Follow the instructions.

instruction:
1. Remove unnecessary data from text.
2. find expectation from text and summarize. 
3. summarize the table of financial statement. 
4. summarize important information. 
 

<example>
{
  "expectation": ["25 년 매출액 1,239 억원(YoY +77.1%), 영업이익 130 억원(YoY +95.4%, OPM10.5%)을 전망"],
  "summaries": [
    "PECVD 및 드라이클리닝 장비 외 BSD(BacksideDeposition), Low-K PECVD 장비를 개발 중. 두 신규 장비 모두 외산 장비 대체이며, 고객사 퀄은 이미 마무리, 내년부터 본격적인 매출 기여가 가능할 것으로 판단",
    "삼성전자는 DDR5 전환 및 레거시 디램 노출도 축소 목적,SK하이닉스는 HBM 생산 확대를 위한 목적. 이 과정에서 동사의 디램수주 규모도 올해 대비 증가함에 따라 매출액 2,662억원(+22% YoY),영업이익 411억원(+93% YoY)으로 성장 전망"
    "디램에서 증가하고 있는 수주액을 고려하면 인식 전환 필요. 현 주가는 내년 실적 기준 P/E 8.X 수준으로 바닥권에 형성되어 있어 부담없는 수준",
  ],
  "financialStatement": ["최근 3년간 영업이익(YoY) 꾸준히 10% 성장"]
}
</example>
`;
