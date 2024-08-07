export async function retry<T>(
  promiseFactory: () => T,
  retryCount: number,
  customError?,
) {
  try {
    return await promiseFactory();
  } catch (error) {
    if (retryCount <= 0) {
      if (customError) {
        throw new customError();
      } else {
        throw error;
      }
    }
    return await retry(promiseFactory, retryCount - 1, customError);
  }
}
