export const errorToJson = (error: Error) =>
  JSON.stringify({
    message: error.message,
    stack: error.stack,
  });
