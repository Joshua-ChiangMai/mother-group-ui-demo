/**
 * Central API configuration. Vite exposes only VITE_* variables to the client bundle.
 * Production builds read .env.production; local dev defaults to /api via the Vite proxy.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const baseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL?.trim() || '/api');

export const apiConfig = {
  /** NestJS API origin without a trailing slash (e.g. https://api.example.com or /api). */
  baseUrl,
  docsUrl: `${baseUrl}/docs`,
  dashboardUrl: `${baseUrl}/`,
};
