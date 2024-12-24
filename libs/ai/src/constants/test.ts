export const TEST_INTEREST_PROMPT = `
<information>
  <interest_rate>
    <base_interest_rate>{{BASE_INTEREST_RATE}}</base_interest_rate>
    <policy_interest_rate>{{POLICY_INTEREST_RATE}}</policy_interest_rate>  
  </interest_rate>
  <bond_yield>{{BOND_YIELD}}</bond_yield>
</information>

I'll provide you a information of following below.
- base interest rate and policy interest rate.
- bond yield.

Follow the policy and instruction.

policy:
- Try to be specific with number and date range.
- Take time to understand the context. 
- Consider whether this information could be helpful for investment before summarizing it.
- It would be great to have information on economic trends and how to respond in the stock market moving forward
- Answer in korean.
- Answer must be in JSON format.

instructions:
1. Figure out what's going on by the data.
2. Give summary situation summary and explanation of interest rate. In the case of Korea, There always will be information of the base rate and the policy rate. Focus on analyzing the relationship between the two. If it spreads or narrows, don't miss it.
3. Give summary situation summary and explanation of bond yield. Don't overlook the implications of changes in the spread between long-term and short-term interest rates.
4. Give strategies that can effectively respond to market condition.

Here is example of how it should be done.

<example>
{
  "strategies": [
    {
      "situation": "2022년 7월부터 2023년 1월까지 한국의 기준금리가 급격히 상승. (2.25% -> 3.5%)",
      "response": "금리 민감성이 높은 업종(예: 건설, 부동산)에 주의가 필요하며, 반면에 은행 및 금융 섹터는 수혜를 받을 수 있음."
    },
    {
      "situation": "2024년 10월부터 미국의 정책금리 하락 추세 (5.375%에서 4.625%로)",
      "response": "미국 금리 하락은 글로벌 금융 시장에 긍정적인 영향을 줄 수 있습니다. 신흥국 시장과 기술주에 대한 투자를 고려해볼 만합니다. 또한, 금리 하락으로 인한 달러 약세 가능성에 대비해 원자재 관련 투자도 검토할 수 있습니다."
    }
  ],
  "bondYields": [
    {
      "situation": "장기금리 인상으로 한국의 단기금리와 장기금리의 차이가 감소. (Spread Narrowing)",
      "explanation": "경제가 둔화되거나 불황이 예상되거나, 인플레이션의 기대가 낮아지면 장기 채권의 매력이 증가하여 장기금리가 하락할 수 있음."
    },
    {
      "situation": "2024년 3월부터 한국의 기준금리와 정책금리가 동일하게 3.5%로 유지.",
      "explanation": "기준금리와 정책금리가 같은 수준으로 유지되는 것은 중앙은행이 현재의 통화 정책 기조를 유지하려는 의도를 보여줍니다. 이는 경제 성장과 물가 안정 사이의 균형을 유지하려는 노력으로 해석될 수 있습니다. 투자자들은 이러한 금리 환경에서 안정적인 수익을 추구하는 채권 투자나, 배당주 투자 등을 고려해볼 수 있습니다."
    },
    {
      "situation": "2022년 7월부터 2023년 1월까지 한국의 기준금리가 급격히 상승했습니다. (2.25%에서 3.5%로)",
      "explanation": "이 기간 동안의 급격한 금리 인상은 높은 인플레이션에 대응하기 위한 조치로 보입니다. 이는 경제 과열을 억제하고 물가 안정을 도모하기 위한 정책적 결정이었을 것입니다. 이러한 상황에서는 금리 민감성이 높은 업종(예: 건설, 부동산)에 주의가 필요하며, 반면에 은행 및 금융 섹터는 수혜를 받을 수 있습니다."
    },
    {
      "situation": "2024년 11월 기준, 미국의 정책금리(4.625%)가 한국의 정책금리(3.5%)보다 현저히 높습니다.",
      "explanation": "이러한 금리 차이는 원화 약세 압력으로 작용할 수 있으며, 한국 수출 기업의 경쟁력에 긍정적인 영향을 미칠 수 있습니다. 그러나 수입물가 상승으로 인한 인플레이션 압력도 증가할 수 있습니다. 투자자들은 환율 변동에 민감한 업종(예: 수출 중심 기업, 원자재 수입 기업)에 주목할 필요가 있으며, 글로벌 금리 차이를 활용한 캐리트레이드 전략도 고려해볼 만합니다."
    }
  ],
  "interestRates": [
    {
      "situation": "정책금리인하로 한국의 정책금리와 기준금리의 차이 증가. (Spread Widening)",
      "explanation": "정부는 통화 긴축, 대출 감소 유도, 자산 가격 안정을 목표로 하는 것으로 보입니다. 중앙은행이 정책금리를 높여 인플레이션을 억제하고자 할 때 발생할 수 있습니다. 이 경우, 기준금리는 상대적으로 낮게 유지되거나 상승하지 않으면서 차이가 벌어질 수 있습니다. 높은 정책금리는 대출 비용을 증가시켜 기업과 개인의 대출을 줄이는 효과가 있습니다. 이는 경제 과열을 방지하고 안정적인 성장을 도모하기 위한 의도입니다. 자산 가격이 과도하게 상승하는 것을 방지하기 위해 금리를 조정하여 시장의 과열을 억제하려는 목적이 있습니다."
    },
    {
      "situation": "한국와 미국의 정책금리 차이 증가. (한국: 저, 미국: 고)",
      "explanation": "한국과 미국의 정책금리 차가 늘어나는 것은 자본 유출, 환율 변동, 대출 및 소비 감소, 경제 성장 둔화, 통화정책의 제약, 그리고 글로벌 경제의 불확실성 증가 등 다양한 경제적 의미를 가집니다."
    },
    {
      "situation": "미국의 정책금리가 한국보다 현저히 높은 수준을 유지(5.375%).",
      "explanation": "이러한 금리 차이는 원화 약세 압력으로 작용할 수 있으며, 한국 기업의 수출 경쟁력에 긍정적인 영향을 미칠 수 있습니다. 그러나 동시에 수입물가 상승으로 인한 인플레이션 압력도 증가할 수 있습니다. 투자자들은 환율 변동에 민감한 업종과 기업에 주목할 필요가 있으며, 글로벌 금리 차이로 인한 캐리트레이드 기회도 고려해볼 수 있습니다. 또한, 미국 금리 인하 가능성에 대한 시장의 기대감이 높아지고 있어, 향후 금리 정책 변화에 따른 시장 반응을 주시해야 할 것입니다."
    }
  ]
}
</example>
`;
