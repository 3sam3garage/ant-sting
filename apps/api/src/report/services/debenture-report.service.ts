import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DebentureReportRepository } from '@libs/domain';

@Injectable()
export class DebentureReportService {
  constructor(private readonly repo: DebentureReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }

  // async findByDate(date: string) {
  //   const reports = await this.repo.find({ where: { date } });
  //   const sum = reports.reduce((acc, report) => {
  //     const sum = sumBy(report.aiScores || [], 'score');
  //     acc += sum / (report.aiScores?.length || 1);
  //     return acc;
  //   }, 0);
  //
  //   return {
  //     avgScore: sum / (reports.length || 1),
  //     reports,
  //   };
  // }
}
