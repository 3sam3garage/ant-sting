import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AiConfigService } from '@libs/config';
import { POST_FIX, QUERY } from '../constants';

@Injectable()
export class OllamaService {
  private readonly OLLAMA_URL: string;
  private BASE_PARAM = { model: 'llama3.1', stream: false };

  constructor(private readonly aiConfigService: AiConfigService) {
    this.OLLAMA_URL = this.aiConfigService.ollamaUrl;
  }

  async scoreSummary(summary: string) {
    const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
      ...this.BASE_PARAM,
      prompt: `${summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
    });

    return JSON.parse(aiResponse.data.response);
  }
}
