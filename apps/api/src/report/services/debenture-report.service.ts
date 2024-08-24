import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DebentureReportRepository } from '@libs/domain';
import { DebentureReportResponse } from '../dto';

@Injectable()
export class DebentureReportService {
  constructor(private readonly repo: DebentureReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string): Promise<DebentureReportResponse[]> {
    return this.repo.find({ where: { date } });
  }
}
