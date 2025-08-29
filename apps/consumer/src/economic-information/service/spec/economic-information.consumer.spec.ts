import * as htmlParser from 'node-html-parser';
import { ObjectId } from 'mongodb';
import { Test, TestingModule } from '@nestjs/testing';
import { EconomicInformationConsumer } from '../economic-information.consumer';
import { EconomicInformationRepository } from '@libs/mongo';
import { NaverPayApi, KcifApi } from '@libs/external-api';
import { Logger } from '@nestjs/common';

describe('EconomicInformationConsumer', () => {
  let consumer: EconomicInformationConsumer;
  let repo: EconomicInformationRepository;
  let naverPayApi: NaverPayApi;
  let kcifApi: KcifApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomicInformationConsumer,
        {
          provide: EconomicInformationRepository,
          useValue: { findOneById: jest.fn(), updateOne: jest.fn() },
        },
        { provide: NaverPayApi, useValue: { detailPage: jest.fn() } },
        { provide: KcifApi, useValue: { detailPage: jest.fn() } },
      ],
    }).compile();

    consumer = module.get(EconomicInformationConsumer);
    repo = module.get(EconomicInformationRepository);
    naverPayApi = module.get(NaverPayApi);
    kcifApi = module.get(KcifApi);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  describe('naver', () => {
    it('should update entity with parsed content', async () => {
      jest.spyOn(naverPayApi, 'detailPage').mockResolvedValue('<html></html>');
      jest.spyOn(htmlParser, 'parse');
      jest.spyOn(repo, 'findOneById').mockResolvedValue({ items: [] } as never);

      const documentId = '507f1f77bcf86cd799439011';
      const url = 'http://test.com';

      const job = { data: { documentId, url } };
      await consumer.naver(job as never);

      expect(naverPayApi.detailPage).toHaveBeenCalledWith(url);
      expect(repo.findOneById).toHaveBeenCalledWith(new ObjectId(documentId));
      expect(repo.updateOne).toHaveBeenCalled();
    });
  });

  describe('kcif', () => {
    it('should return with warning when content is missing', async () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();
      jest.spyOn(kcifApi, 'detailPage').mockResolvedValue('<html></html>');
      jest.spyOn(htmlParser, 'parse');
      jest.spyOn(repo, 'findOneById').mockResolvedValue({ items: [] } as never);

      const documentId = '507f1f77bcf86cd799439011';
      const url = 'http://test.com';

      const job = { data: { documentId, url } };
      await consumer.kcif(job as never);

      expect(kcifApi.detailPage).toHaveBeenCalledWith(url);
      expect(warnSpy).toHaveBeenCalledWith('컨텐츠가 없습니다.');
    });

    it('should update entity with parsed content', async () => {
      jest
        .spyOn(kcifApi, 'detailPage')
        .mockResolvedValue('<html><div class="cont_area">1234</div></html>');
      jest.spyOn(htmlParser, 'parse');
      jest.spyOn(repo, 'findOneById').mockResolvedValue({ items: [] } as never);

      const documentId = '507f1f77bcf86cd799439011';
      const url = 'http://test.com';

      const job = { data: { documentId, url } };
      await consumer.kcif(job as never);

      expect(kcifApi.detailPage).toHaveBeenCalledWith(url);
      expect(repo.findOneById).toHaveBeenCalledWith(new ObjectId(documentId));
      expect(repo.updateOne).toHaveBeenCalled();
    });
  });
});
