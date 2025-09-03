export const onlyDigits = (text: string): string => {
  return (text?.toString() || '')?.replaceAll(/\D/g, '');
};
