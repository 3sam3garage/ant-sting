import { isNil, omitBy } from 'lodash';

export const omitIsNil = (obj: Record<string, unknown>) => omitBy(obj, isNil);
