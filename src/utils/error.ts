import { ApiError } from '../api/client';

export function getErrorMessage(error: unknown, fallback = 'Erro inesperado') {
  if (!error) return fallback;
  if (error instanceof ApiError) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (typeof (error as any)?.message === 'string') {
    return (error as any).message;
  }
  return fallback;
}
