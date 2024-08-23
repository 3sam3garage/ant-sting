export const formatSixDigitDate = (dirtyDate: string) => {
  const regex = /^(\d{2})\.(\d{2})\.(\d{2})$/;

  const date = dirtyDate.replace(regex, '20$1-$2-$3');
  return new Date(date);
};
