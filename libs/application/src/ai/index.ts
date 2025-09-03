import { ContentListUnion } from '@google/genai';

export interface AIServiceImpl {
  upload(file: { data: Blob | string; mimeType: string }): Promise<unknown>;

  invoke(query: {
    model?: string;
    contents: ContentListUnion;
  }): Promise<Record<string, any>>;
}
