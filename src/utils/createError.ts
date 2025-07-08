// utils/createError.ts

export function createError(message: string, statusCode = 400) {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}
