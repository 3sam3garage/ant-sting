import { registerAs } from '@nestjs/config';
import { NODE_ENV } from '../config.constants';

export interface CommonConfig {
  /** 컨테이너 여부 */
  IS_CONTAINER: boolean;

  /** 실행 환경 */
  NODE_ENV: NODE_ENV;

  /** 포트 */
  PORT: number;
}

export default registerAs<CommonConfig>('COMMON', () => {
  const { env } = process;
  const nodeEnv =
    (env.NODE_ENV as NODE_ENV | undefined) ?? NODE_ENV.DEVELOPMENT;

  return {
    IS_CONTAINER: !!env.IS_CONTAINER,
    NODE_ENV: nodeEnv,
    PORT: parseInt(env.PORT ?? '8080'),
  };
});
