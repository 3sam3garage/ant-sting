import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { eucKR2utf8 } from './euc-kr-to-utf8';

const REQUEST_HEADERS = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
};

export const requestAndParseEucKr = async (
  url: string,
  params: Record<string, string | number> = {},
) => {
  const response = await axios.get(url, {
    headers: { ...REQUEST_HEADERS },
    responseType: 'arraybuffer',
    params: params,
  });

  const text = eucKR2utf8(response.data);
  return parseToHTML(text);
};
