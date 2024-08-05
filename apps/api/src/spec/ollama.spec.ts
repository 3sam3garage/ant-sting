import axios from 'axios';
import { REPORT_SUMMARY, QUERY, POST_FIX } from '@libs/domain';

describe('ollama', () => {
  it(
    'llama 3.1 api',
    async () => {
      const responses = [];

      for (let i = 0; i < 3; i++) {
        const res = await axios.post('http://localhost:11434/api/generate', {
          model: 'llama3.1',
          prompt: `${REPORT_SUMMARY} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        });

        responses.push(res.data.response);
      }

      console.log(responses);
    },
    120 * 1000,
  );
});
