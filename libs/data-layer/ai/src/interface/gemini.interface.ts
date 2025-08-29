import { ContentListUnion } from '@google/genai';

export interface GeminiInvokeQuery {
  model?: string;
  contents: ContentListUnion;
}
