import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  isBefore,
  isWithinInterval,
  subMonths,
} from 'date-fns';
import { isNil, omitBy } from 'lodash';
import { formatDistanceToNow } from 'date-fns';

it('test', () => {
  const givenDate = new Date('2025-01-27T12:45:00'); // 예시로 주어진 날짜
  const difference = formatDistanceToNow(givenDate, { addSuffix: true });

  console.log(`주어진 시간은 현재 시간과 ${difference} 차이가 있습니다.`);
});

it('add day', () => {
  const days = addDays(new Date(), 44);
  console.log(days);
});

it('isBefore', () => {
  const beforeMonth = subMonths(new Date(), 1);
  const target = new Date('2024-12-10');

  const res = isBefore(target, beforeMonth);
  console.log(res);
});

it('within interval', () => {
  const days = isWithinInterval(new Date(), {
    start: '2024-01-01',
    end: '2025-01-03',
  });
  console.log(days);
});

it('day interval', () => {
  const days = eachDayOfInterval({ start: '2024-01-01', end: '2024-02-02' });
  console.log(days);
});

it('month interval', () => {
  const months = eachMonthOfInterval({ start: '2022-01', end: '2024-02' });
  console.log(months);
});

it('regex', () => {
  const escapeForRegex = (s: string): string =>
    s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const res = escapeForRegex('');
  console.log(res);

  const q = {
    a: '',
    b: '',
  };

  const t = omitBy(q, isNil);
  console.log(t);
});

it('map', () => {
  const map = new Map();
  map.set('a', 1);
  map.set('b', 2);

  for (const [key, val] of map) {
    console.log(key, val);
  }
});
