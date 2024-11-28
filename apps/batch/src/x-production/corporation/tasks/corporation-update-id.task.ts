import { Injectable } from '@nestjs/common';
import unzipper from 'unzipper';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { Corporation, CorporationRepository } from '@libs/domain';

@Injectable()
export class CorporationUpdateIdTask {
  private readonly URL = 'https://opendart.fss.or.kr/api/corpCode.xml';

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
    private readonly corporationRepo: CorporationRepository,
  ) {}

  async exec(): Promise<void> {
    const res = await axios.get(this.URL, {
      params: { crtfc_key: this.externalApiConfigService.openDartApiKey },
      responseType: 'arraybuffer',
    });

    const { files } = await unzipper.Open.buffer(res.data);
    const [file] = files;

    const content = await file.buffer();

    const {
      result: { list },
    } = await parseStringPromise(content.toString(), {
      trim: true,
      explicitArray: false,
      emptyTag: () => null,
    });

    for (const item of list) {
      const corporation = await this.corporationRepo.findOne({
        where: { code: item.corp_code },
      });
      const source = Corporation.createFromSource(item);
      const entity = corporation ? { ...corporation, ...source } : source;
      await this.corporationRepo.save(entity);
    }
  }
}
