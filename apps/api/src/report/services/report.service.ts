import { Injectable } from '@nestjs/common';
import { ReportSummaryRepository } from '@libs/domain';
import { FindReportSummariesQuery } from '../dto';

@Injectable()
export class ReportService {
  constructor(private readonly repo: ReportSummaryRepository) {}

  async findSummaries({ date, types }: FindReportSummariesQuery) {
    const query = { date };
    if (types?.length > 0) {
      query['type'] = { $in: types };
    }

    return this.repo.find({ where: query });
  }
}
