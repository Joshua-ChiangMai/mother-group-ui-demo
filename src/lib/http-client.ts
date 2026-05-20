import { apiConfig } from './config';
import { ApiError } from './types';

export class HttpError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

function parseErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const message = (payload as ApiError).message;
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return fallback;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiConfig.baseUrl}${normalizedPath}`;
}

/**
 * Thin fetch wrapper for the Alpha/Nest API. Keeps request/response handling in one place.
 */
export async function httpRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new HttpError(
      parseErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  return payload as T;
}
