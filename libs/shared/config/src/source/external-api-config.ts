import { registerAs } from '@nestjs/config';

export interface ExternalApiConfig {
  /** 구글 AI 스튜디오 */
  GOOGLE_AI_STUDIO_API_KEY: string;

  SLACK_WEBHOOK_URL: string;

  SLACK_TOKEN: string;
}

export default registerAs<ExternalApiConfig>('EXTERNAL_API', () => {
  const { env } = process;

  return {
    SLACK_WEBHOOK_URL: env.SLACK_WEBHOOK_URL,
    SLACK_TOKEN: env.SLACK_TOKEN,
    GOOGLE_AI_STUDIO_API_KEY: env.GOOGLE_AI_STUDIO_API_KEY,
  };
});
