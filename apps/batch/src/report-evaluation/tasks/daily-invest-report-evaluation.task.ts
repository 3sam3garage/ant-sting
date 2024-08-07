import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import {
  InvestReportRepository,
  POST_FIX,
  QUERY,
  ReportSummary,
  ReportSummaryRepository,
} from '@libs/domain';
import axios from 'axios';
import { retry } from '@libs/common';
import { REPORT_SUMMARY_TYPE } from '@libs/domain/report-summary/constants';

@Injectable()
export class DailyInvestReportEvaluationTask {
  constructor(
    private readonly investReportRepo: InvestReportRepository,
    private readonly reportSummaryRepo: ReportSummaryRepository,
  ) {}

  async exec() {
    const date = format(new Date('2024-08-01'), 'yyyy-MM-dd');
    // @todo 요 date 날짜는 나중에 뺄 것.
    const reports = await this.investReportRepo.find({
      where: { summary: { $exists: true }, date },
      select: { summary: true },
    });

    const summary = reports.reduce((acc, report) => {
      acc += report.summary + `\n\n`;
      return acc;
    }, '');

    await retry(async () => {
      const aiResponse = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3.1',
          prompt: `${summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        },
      );

      const response = JSON.parse(aiResponse.data.response);

      const entity = ReportSummary.create({
        ...response,
        date,
        type: REPORT_SUMMARY_TYPE.DAILY_INVEST_REPORT_SUMMARY,
      });
      await this.reportSummaryRepo.save(entity);
    }, 3);
  }
}
