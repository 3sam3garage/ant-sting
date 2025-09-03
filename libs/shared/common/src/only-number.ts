export const onlyNumber = (text: string): number => {
  return +(text?.toString() || '')?.replaceAll(/\D/g, '');
};
