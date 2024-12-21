import { createHash } from 'crypto';

it('test', () => {
  const res = createHash('sha256')
    .update('디어앤컴퍼니 (DE US/Not Rated)')
    .digest('hex');
  console.log(res);
});
