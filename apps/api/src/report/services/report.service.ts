import { Injectable } from '@nestjs/common';
import { ReportSummaryRepository } from '@libs/domain';
import { FindReportSummariesQuery } from '../dto';

@Injectable()
export class ReportService {
  constructor(private readonly repo: ReportSummaryRepository) {}

  // async figureLatest7Days(): Promise<string[]> {
  //   return [
  //     '2024-08-02',
  //     '2024-08-03',
  //     '2024-08-04',
  //     '2024-08-05',
  //     '2024-08-06',
  //     '2024-08-07',
  //     '2024-08-08',
  //   ];
  // }

  async findSummaries({ date, types }: FindReportSummariesQuery) {
    const query = { date };
    if (types?.length > 0) {
      query['type'] = { $in: types };
    }

    return this.repo.find({ where: query });
  }
}
