import { registerAs } from '@nestjs/config';

export interface ExternalApiConfig {
  /** OLLAMA URL */
  OLLAMA_URL: string;

  // 공공 API
  DATA_GO_SERVICE_KEY: string;

  // 전자공시시스템
  OPEN_DART_API_KEY: string;

  // 한국은행
  ECOS_API_KEY: string;

  // FRED 연방은행
  FRED_API_KEY: string;

  // 구글 AI 스튜디오
  GOOGLE_AI_STUDIO_API_KEY: string;

  SLACK_WEBHOOK_URL: string;

  SLACK_TOKEN: string;
}

export default registerAs<ExternalApiConfig>('EXTERNAL_API', () => {
  const { env } = process;

  return {
    SLACK_WEBHOOK_URL: env.SLACK_WEBHOOK_URL,
    SLACK_TOKEN: env.SLACK_TOKEN,
    OLLAMA_URL: env.OLLAMA_URL,
    DATA_GO_SERVICE_KEY: env.DATA_GO_SERVICE_KEY,
    OPEN_DART_API_KEY: env.OPEN_DART_API_KEY,
    ECOS_API_KEY: env.ECOS_API_KEY,
    FRED_API_KEY: env.FRED_API_KEY,
    GOOGLE_AI_STUDIO_API_KEY: env.GOOGLE_AI_STUDIO_API_KEY,
  };
});
