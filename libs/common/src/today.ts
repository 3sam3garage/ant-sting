import { format } from 'date-fns';

export const today = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
