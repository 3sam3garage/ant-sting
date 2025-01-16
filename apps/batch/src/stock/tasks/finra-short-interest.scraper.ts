import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { parse } from 'csv-parse/sync';
import { ShortInterest, ShortInterestRepository } from '@libs/domain';
import { FinraShortInterest } from '../interface';

@Injectable()
export class FinraShortInterestScraper {
  private readonly url =
    'https://www.finra.org/finra-data/browse-catalog/equity-short-interest/files';

  constructor(private readonly shortInterestRepo: ShortInterestRepository) {}

  private async processShortInterestItems(items: FinraShortInterest[]) {
    for (const shortInterest of items) {
      const {
        issueName,
        symbolCode,
        averageDailyVolumeQuantity,
        currentShortPositionQuantity,
        settlementDate,
      } = shortInterest;
      const foundEntity = await this.shortInterestRepo.findOne({
        where: { ticker: symbolCode },
      });

      if (foundEntity) {
        const needUpdate = foundEntity.addItem({
          averageDailyVolume: +averageDailyVolumeQuantity,
          quantity: +currentShortPositionQuantity,
          date: settlementDate,
        });

        if (needUpdate) {
          await this.shortInterestRepo.save(foundEntity);
        }
        continue;
      }

      const entity = ShortInterest.create({
        stockName: issueName,
        ticker: symbolCode,
      });
      entity.addItem({
        averageDailyVolume: +averageDailyVolumeQuantity,
        quantity: +currentShortPositionQuantity,
        date: settlementDate,
      });

      await this.shortInterestRepo.save(entity);
    }
  }

  async exec() {
    Logger.log('scrape finra-short-interest start');

    const res = await axios.get(this.url);
    const html = parseToHTML(res.data);

    const fileAnchors = html.querySelectorAll('div.item-list a');
    const fileUrls = fileAnchors.map((anchor) => anchor.getAttribute('href'));

    for (const url of fileUrls) {
      Logger.log(`processing ${url}`);
      const file = await axios.get(url);
      const items: FinraShortInterest[] = parse(file.data, {
        delimiter: '|',
        columns: true,
        skipEmptyLines: true,
        skipRecordsWithError: true,
      });

      await this.processShortInterestItems(items);
    }

    Logger.log('scrape finra-short-interest done');
  }
}
