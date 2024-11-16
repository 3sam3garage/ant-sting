export const figureNid = (link: string): string => {
  const [, params] = link.split('?');
  const queries = params.split('&');

  for (const query of queries) {
    if (query.includes('nid')) {
      const [, value] = query.split('=');
      return value?.trim();
    }
  }

  return '';
};
