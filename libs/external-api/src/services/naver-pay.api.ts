import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';

@Injectable()
export class NaverPayApi {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}
}
