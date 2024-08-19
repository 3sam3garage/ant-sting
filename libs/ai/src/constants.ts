export const QUERY = `Based on the information provided above, please assign a overall score conservatively from 1 to 5 to indicate whether the stock market is booming, and explain the reasoning behind it.`;
export const POST_FIX = `Answer them in json format like { reason: <your reason>, score: <your score>} Don't add anything other than JSON object and Don't forget quotation mark in JSON`;

export const OPINION_QUERY =
  'Based on the information provided above, Please extract the current price, target price, and buy recommendation from the given information';
export const OPINION_QUERY_POST_FIX = `Answer them in json format like {
  price: <current price>
  targetPrice: <target price>
  position: <buy recommendation>
} Don't add anything other than JSON object and Don't forget quotation mark in JSON. Don't add code block`;

export const FORMATTING_JSON_QUERY = 'remove anything other than json';
export const FORMATTING_JSON_QUERY_POST_FIX =
  "Don't add anything other than JSON object and Don't forget quotation mark in JSON. Don't add code block";
