import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeRssJob } from '../scrape-rss.job';
import { SecApiService } from '@libs/external-api';
import { SecFeedRedisRepository } from '@libs/domain-redis';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';
import { Logger } from '@nestjs/common';

describe('ScrapeRssJob', () => {
  let job: ScrapeRssJob;
  let secApiService: SecApiService;
  let secFeedRedisRepository: SecFeedRedisRepository;
  let queue: Queue;

  beforeEach(async () => {
    const secApiServiceMock = {
      fetchRSS: jest.fn(),
    };
    const secFeedRedisRepositoryMock = {
      exists: jest.fn(),
      addToSet: jest.fn(),
    };
    const queueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeRssJob,
        { provide: SecApiService, useValue: secApiServiceMock },
        {
          provide: SecFeedRedisRepository,
          useValue: secFeedRedisRepositoryMock,
        },
        { provide: 'BullQueue_' + QUEUE_NAME.ANALYZE_13F, useValue: queueMock },
      ],
    }).compile();

    job = module.get<ScrapeRssJob>(ScrapeRssJob);
    secApiService = module.get<SecApiService>(SecApiService);
    secFeedRedisRepository = module.get<SecFeedRedisRepository>(
      SecFeedRedisRepository,
    );
    queue = module.get<Queue>('BullQueue_' + QUEUE_NAME.ANALYZE_13F);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('run() should process new feeds and skip processed ones', async () => {
    const entries = [
      { link: { $: { href: 'url1' } } },
      { link: { $: { href: 'url2' } } },
    ];
    secApiService.fetchRSS = jest
      .fn()
      .mockResolvedValue({ feed: { entry: entries } });
    secFeedRedisRepository.exists = jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    queue.add = jest.fn();
    secFeedRedisRepository.addToSet = jest.fn();

    await job.run();

    expect(secApiService.fetchRSS).toHaveBeenCalled();
    expect(secFeedRedisRepository.exists).toHaveBeenCalledWith('url1');
    expect(secFeedRedisRepository.exists).toHaveBeenCalledWith('url2');
    expect(queue.add).toHaveBeenCalledWith(
      { url: 'url1' },
      { removeOnComplete: true },
    );
    expect(secFeedRedisRepository.addToSet).toHaveBeenCalledWith('url1');
    expect(queue.add).toHaveBeenCalledTimes(1);
    expect(secFeedRedisRepository.addToSet).toHaveBeenCalledTimes(1);
  });

  it('handle() should not run if already running', async () => {
    job['isRunning'] = true;
    const logSpy = jest.spyOn(Logger, 'warn').mockImplementation();
    await job.handle();
    expect(logSpy).toHaveBeenCalledWith(
      '이미 scrape-sec-rss 스케줄러가 동작중입니다.',
    );
    logSpy.mockRestore();
  });

  it('handle() should set isRunning, call run, and reset isRunning', async () => {
    job['isRunning'] = false;
    const runSpy = jest.spyOn(job, 'run').mockResolvedValue();
    await job.handle();
    expect(runSpy).toHaveBeenCalled();
    expect(job['isRunning']).toBe(false);
    runSpy.mockRestore();
  });

  it('handle() should log error if run throws', async () => {
    job['isRunning'] = false;
    jest.spyOn(job, 'run').mockRejectedValue(new Error('fail'));
    const errorSpy = jest.spyOn(Logger, 'error').mockImplementation();
    await job.handle();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
