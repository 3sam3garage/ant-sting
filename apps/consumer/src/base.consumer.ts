import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

export class BaseConsumer {
  @OnQueueActive()
  async onQueueActive(job: Job) {
    Logger.log(`jobId: ${job.id} start`);
  }

  @OnQueueCompleted()
  async onQueueComplete(job: Job) {
    Logger.log(`${job?.data} done`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job) {
    Logger.error(`jobId: ${job?.data}  Failed : ${job?.failedReason}`);
  }

  @OnQueueError()
  async OnQueueError(e) {
    Logger.error(e);
  }
}
