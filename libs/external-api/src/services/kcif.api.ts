import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';

@Injectable()
export class KcifApi {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}
}
