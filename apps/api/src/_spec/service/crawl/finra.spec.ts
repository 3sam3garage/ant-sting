import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';

describe('finra', () => {
  it('short interest', async () => {
    const res = await axios.get(
      'https://www.finra.org/finra-data/browse-catalog/equity-short-interest/files',
    );
    const html = parseToHTML(res.data);

    const fileAnchors = html.querySelectorAll('div.item-list a');
    const fileUrls = fileAnchors.map((anchor) => anchor.getAttribute('href'));

    console.log(fileUrls);
  });
});
