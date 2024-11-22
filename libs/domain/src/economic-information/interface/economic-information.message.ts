import { ECONOMIC_INFO_SOURCE } from '../constants';

export interface EconomicInformationMessage {
  url: string;
  documentId: string;
  source: ECONOMIC_INFO_SOURCE;
}
