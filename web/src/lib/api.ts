const API_URL = process.env.MOCK_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_MOCK_API_KEY;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Absolute URL on the mock API. Server only: MOCK_API_URL is not available in the browser. */
export function apiUrl(path: string): URL {
  if (!API_URL) {
    throw new Error('MOCK_API_URL is not set');
  }
  return new URL(path, API_URL);
}

/** Fetches JSON and throws HttpError on non-2xx. Shared by the route handlers and the client components. */
export async function getJson<T>(url: string | URL, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'X-Api-Key': API_KEY ?? '',
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new HttpError(res.status, `GET ${url} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}
