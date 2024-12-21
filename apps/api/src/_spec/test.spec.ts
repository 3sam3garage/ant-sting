import { createHash } from 'crypto';
import { eachDayOfInterval, eachMonthOfInterval } from 'date-fns';

it('test', () => {
  const res = createHash('sha256')
    .update('디어앤컴퍼니 (DE US/Not Rated)')
    .digest('hex');
  console.log(res);
});

it('day interval', () => {
  const days = eachDayOfInterval({ start: '2024-01-01', end: '2024-02-02' });
  console.log(days);
});

it('month interval', () => {
  const months = eachMonthOfInterval({ start: '2022-01', end: '2024-02' });
  console.log(months);
});
