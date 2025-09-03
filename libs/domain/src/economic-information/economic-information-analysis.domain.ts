import { BaseEntity } from '../base.entity';

class Strategy {
  action: string;
  reason: string;
}

class Question {
  question: string;
  answer: string;
}

export class EconomicInformationAnalysis extends BaseEntity {
  summaries: string[];
  insights: string[];
  strategies: Strategy[];
  questions: Question[];
  terminologies: string[];
  date: string;
}
