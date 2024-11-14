import { REPORT_TYPE } from '@libs/domain';

export interface MacroEnvironmentMessage {
  url: string;
  reportType: REPORT_TYPE;
  documentId: string;
}
