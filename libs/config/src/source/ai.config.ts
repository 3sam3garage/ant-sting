import { registerAs } from '@nestjs/config';

export interface AiConfig {
  /** OLLAMA URL */
  OLLAMA_URL: string;
}

export default registerAs<AiConfig>('AI', () => {
  const { env } = process;

  return {
    OLLAMA_URL: env.OLLAMA_URL,
  };
});
