import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { BASE_SYSTEM_PROMPT } from '@libs/ai/constants';

@Injectable()
export class OllamaService {
  private readonly OLLAMA_URL: string;
  private BASE_PARAM = { model: 'gemma3:4b', stream: false };

  constructor(private readonly aiConfigService: ExternalApiConfigService) {
    this.OLLAMA_URL = this.aiConfigService.ollamaUrl;
  }

  async invoke(prompt: string): Promise<Record<string, any>> {
    const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
      ...this.BASE_PARAM,
      prompt,
    });

    console.log(aiResponse.data.response);
    return JSON.parse(aiResponse.data.response);
  }

  async invokeMultimodal(query: any): Promise<Record<string, any>> {
    const { prompt, images } = query;
    const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
      ...this.BASE_PARAM,
      prompt,
      images,
      system: BASE_SYSTEM_PROMPT,
      format: 'json',
    });

    console.log(aiResponse.data.response);
    return JSON.parse(aiResponse.data.response);
  }
}
