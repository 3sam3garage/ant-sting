import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';

@Injectable()
export class OllamaService {
  private readonly OLLAMA_URL: string;
  private BASE_PARAM = { model: 'llama3.3', stream: false };

  constructor(private readonly aiConfigService: ExternalApiConfigService) {
    this.OLLAMA_URL = this.aiConfigService.ollamaUrl;
  }

  async invoke(prompt: string): Promise<Record<string, any>> {
    const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
      ...this.BASE_PARAM,
      prompt,
    });

    return JSON.parse(aiResponse.data.response);
  }

  // private async formatJSON(text: string) {
  //   try {
  //     return JSON.parse(text);
  //   } catch (e) {
  //     console.log(text);
  //     Logger.debug('json parsing error. rerunning');
  //     const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
  //       ...this.BASE_PARAM,
  //       prompt: `text \n\n ${FORMATTING_JSON_QUERY} \n\n ${FORMATTING_JSON_QUERY_POST_FIX}`,
  //     });
  //
  //     return JSON.parse(aiResponse.data.response);
  //   }
  // }
  //
  // async scoreSummary(summary: string): Promise<AiScore> {
  //   const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
  //     ...this.BASE_PARAM,
  //     prompt: `${summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
  //   });
  //
  //   return this.formatJSON(aiResponse.data.response);
  // }
  //
  // async figureReportOpinion(text: string): Promise<Opinion> {
  //   const aiResponse = await axios.post(`${this.OLLAMA_URL}/api/generate`, {
  //     ...this.BASE_PARAM,
  //     prompt: `${text} \n\n ${OPINION_QUERY} \n\n ${OPINION_QUERY_POST_FIX}`,
  //   });
  //
  //   return this.formatJSON(aiResponse.data.response);
  // }
}
