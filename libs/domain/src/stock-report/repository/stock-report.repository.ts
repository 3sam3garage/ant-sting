import { FilterOperators, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockReport } from '../entity';
import { FindStockByDate } from '@libs/domain/stock-report/interfaces/find-report.interface';

@Injectable()
export class StockReportRepository extends MongoRepository<StockReport> {
  private readonly QUERY_LIMIT = 1000;

  constructor(
    @InjectRepository(StockReport)
    private readonly repo: MongoRepository<StockReport>,
  ) {
    super(StockReport, repo.manager);
  }

  async findOneByUid(uuid: string) {
    return this.repo.findOne({ where: { uuid } });
  }

  async findByDate(query: FindStockByDate) {
    const { from, to, code } = query;

    const filterQuery: FilterOperators<StockReport> = {
      where: {},
    };
    if (code) {
      filterQuery.where = { ...filterQuery.where, code };
    }
    if (from && to) {
      filterQuery.where.date = { $gte: from, $lte: to };
    }

    return await this.repo.find({
      ...filterQuery,
      take: this.QUERY_LIMIT,
      order: { _id: -1 },
    });
  }

  async countByDate(query: FindStockByDate) {
    const { from, to, code } = query;
    const filterQuery: FilterOperators<StockReport> = {};
    if (code) {
      filterQuery.code = code;
    }
    if (from && to) {
      filterQuery.date = { $gte: from, $lte: to };
    }

    return this.repo.count(filterQuery);
  }
}
