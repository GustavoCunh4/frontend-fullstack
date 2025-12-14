import { API_BASE_URL } from '../config';

export interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function buildHeaders(options: ApiFetchOptions) {
  const headers = new Headers(options.headers ?? {});
  if (options.method && options.method.toUpperCase() !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    signal: options.signal,
    headers: buildHeaders(options),
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body)
  });

  const rawText = await response.text();
  let data: any = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Erro ${response.status} ao acessar a API`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
