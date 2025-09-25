import { BaseDomainEntity } from '../base.domain.entity';

class Strategy {
  action: string;
  reason: string;
}

class Question {
  question: string;
  answer: string;
}

export class EconomicInformationAnalysis extends BaseDomainEntity {
  summaries: string[];
  insights: string[];
  strategies: Strategy[];
  questions: Question[];
  terminologies: string[];
  date: string;
}
