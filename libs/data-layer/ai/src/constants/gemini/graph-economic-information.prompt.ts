export const GRAPH_ECONOMIC_INFORMATION_PROMPT = `
"""
text={{ECONOMIC_INFORMATION}}
"""

Follow this instructions:
1. Group information which has similar context. 
2. Analyze grouped information.
3. Pick up to 10 keywords that matters the most and make connection which is related to each other. either in context or by common sense.
4. leave biggest cluster and remove others from connection.

Follow this policies:
- Answer must be in korean.
- DO NOT MENTION INDIVIDUAL STOCK unless it is necessary.
- DO NOT USE PARENTHESES.

example:
{
  "keywords": [
    "미국_고용지표",
    "관세",
    "금리인하",
    "삼성전자",
    "소외주_순환매",
    "코스피",
    "상법_개정안",
    "트럼프",
    "중국_경기부양책",
    "미국_채권금리"
  ],
  "connections": [
    {
      "from": "미국_고용지표",
      "to": "금리인하"
    },
    {
      "from": "미국_고용지표",
      "to": "달러_강세"
    },
    {
      "from": "관세",
      "to": "삼성전자"
    },
    {
      "from": "관세",
      "to": "소외주_순환매"
    },
    {
      "from": "상법_개정안",
      "to": "코스피"
    },
    {
      "from": "코스피",
      "to": "삼성전자"
    },
    {
      "from": "금리인하",
      "to": "미국_채권금리"
    },
    {
      "from": "트럼프",
      "to": "미국_채권금리"
    },
    {
      "from": "소외주_순환매",
      "to": "코스피"
    },
    {
      "from": "미국_고용지표",
      "to": "트럼프"
    },
    {
      "from": "트럼프",
      "to": "관세"
    },
    {
      "from": "미국_채권금리",
      "to": "금리인하"
    }
  ]
}
`;
