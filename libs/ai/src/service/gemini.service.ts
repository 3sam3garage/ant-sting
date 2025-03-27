import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import { BASE_SYSTEM_PROMPT } from '@libs/ai/constants';
import { GoogleGenAI } from '@google/genai';
import { GeminiInvokeQuery } from '@libs/ai';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private BASE_PARAM = { model: 'gemini-2.0-flash' };

  constructor(private readonly aiConfigService: ExternalApiConfigService) {
    const apiKey = this.aiConfigService.googleAIStudioApiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async upload(file: { data: Blob | string; mimeType: string }) {
    const { data, mimeType } = file;

    return await this.ai.files.upload({
      file: data,
      config: { mimeType: mimeType },
    });
  }

  async invoke(query: GeminiInvokeQuery): Promise<Record<string, any>> {
    const { contents } = query;

    const response = await this.ai.models.generateContent({
      ...this.BASE_PARAM,
      contents,
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    // console.log(response?.candidates?.[0]?.content?.parts?.[0]?.text);
    return JSON.parse(response?.candidates?.[0]?.content?.parts?.[0]?.text);
  }
}
