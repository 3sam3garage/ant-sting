import { AxiosRequestConfig } from 'axios';

export const FILE_DOWNLOAD_HEADER: Partial<AxiosRequestConfig> = {
  responseType: 'arraybuffer',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
};
