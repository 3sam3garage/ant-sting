import { AIScore } from '../base.report.entity';

export const figureAverageScore = (scores: AIScore[]) => {
  const sum = scores.reduce((acc, cur) => {
    acc += +cur.score;
    return acc;
  }, 0);

  return sum / scores.length;
};
