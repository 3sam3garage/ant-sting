import { registerAs } from '@nestjs/config';

export interface ExternalApiConfig {
  /** OLLAMA URL */
  OLLAMA_URL: string;

  DATA_GO_SERVICE_KEY: string;

  OPEN_DART_API_KEY: string;
}

export default registerAs<ExternalApiConfig>('EXTERNAL_API', () => {
  const { env } = process;

  return {
    OLLAMA_URL: env.OLLAMA_URL,
    DATA_GO_SERVICE_KEY: env.DATA_GO_SERVICE_KEY,
    OPEN_DART_API_KEY: env.OPEN_DART_API_KEY,
  };
});
