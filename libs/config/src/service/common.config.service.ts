import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NODE_ENV } from '../config.constants';
import commonConfig from '../source/common.config';

@Injectable()
export class CommonConfigService {
  constructor(
    @Inject(commonConfig.KEY)
    private readonly config: ConfigType<typeof commonConfig>,
  ) {}

  get isContainer() {
    return this.config.IS_CONTAINER;
  }

  get port(): number {
    return this.config.PORT;
  }

  get nodeEnv(): NODE_ENV {
    return this.config.NODE_ENV;
  }
}
