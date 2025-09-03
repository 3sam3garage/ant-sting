import { FilingRss, SecFiling } from '@libs/domain';

export interface SecApiImpl {
  fetchSubmission(cik: string): Promise<SecFiling>;
  fetchRSS(start?: number, count?: number): Promise<FilingRss>;
}
