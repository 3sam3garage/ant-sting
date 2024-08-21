import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as child_process from 'node:child_process';

@Injectable()
export class CronWorker {
  @Cron('30 9 * * *')
  reportCrawling() {
    Logger.debug('report crawling start');
    child_process.execSync('npm run start:batch:report:invest');
    child_process.execSync('npm run start:batch:report:market-info');
    child_process.execSync('npm run start:batch:report:industry');
    child_process.execSync('npm run start:batch:report:economy');
    child_process.execSync('npm run start:batch:report:debenture');
    child_process.execSync('npm run start:batch:report:stock');
    Logger.debug('report crawling done');
  }

  @Cron('30 10 * * *')
  reportSummary() {
    Logger.debug('report summary start');
    child_process.execSync('start:batch:report:summary');
    Logger.debug('report summary done');
  }
}
