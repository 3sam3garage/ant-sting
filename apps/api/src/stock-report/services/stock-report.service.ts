import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockReportRepository } from '@libs/domain';
import { FindByDateQuery } from '../../components';
import { countBy } from 'lodash';

@Injectable()
export class StockReportService {
  constructor(private readonly repo: StockReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(query: FindByDateQuery) {
    const { from, to } = query;
    return await this.repo.findByDate(from, to);
  }

  async countByDate(query: FindByDateQuery) {
    const { from, to } = query;
    const count = await this.repo.countByDate(from, to);

    return { count };
  }

  async figureShare(query: FindByDateQuery) {
    const { from, to } = query;
    const reports = await this.repo.findByDate(from, to);
    const share = countBy(reports, 'market');

    return { share };
  }

  async countByReport(query: FindByDateQuery) {
    const { from, to } = query;
    const reports = await this.repo.findByDate(from, to);
    const share = countBy(reports, 'code');

    const map = new Map();
    for (const report of reports) {
      map.set(report.code, report.stockName);
    }

    const items = [];
    for (const [key, value] of Object.entries(share)) {
      const name = map.get(key);
      items.push({ name: `${name} (${key})`, value });
    }
    return { items };
  }
}
