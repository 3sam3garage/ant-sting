export const toTenDigitCIK = (cik: string | number): string => {
  const original = [...cik.toString().trim()];

  const diff = 10 - original.length;
  if (diff !== 0) {
    const formatted = [...new Array(diff).fill(0), ...original];
    return formatted.join('');
  }

  return original.join('');
};
