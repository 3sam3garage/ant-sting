import iconv from 'iconv-lite';

export const eucKR2utf8 = (buffer: Buffer) => {
  const modifiedBuffer = iconv.decode(buffer, 'EUC-KR');
  return Buffer.from(modifiedBuffer).toString('utf-8');
};
