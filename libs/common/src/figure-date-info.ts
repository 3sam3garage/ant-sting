import { endOfDay, format, startOfDay } from 'date-fns';

export const figureDateInfo = (date = new Date()) => {
  return {
    startOfDay: startOfDay(date),
    endOfDay: endOfDay(date),
    date: format(date, 'yyyy-MM-dd'),
    baseDate: date,
  };
};
