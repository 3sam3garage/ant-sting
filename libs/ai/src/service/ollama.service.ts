import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';

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
}
