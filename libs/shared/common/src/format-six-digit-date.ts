export const formatSixDigitDate = (dirtyDate: string) => {
  const regex = /^(\d{2})\.(\d{2})\.(\d{2})$/;

  return dirtyDate.replace(regex, '20$1-$2-$3');
};

export const formatEightDigitDate = (dirtyDate: string) => {
  const regex = /^(\d{4})\.(\d{2})\.(\d{2})$/;

  return dirtyDate.replace(regex, '$1-$2-$3');
};
