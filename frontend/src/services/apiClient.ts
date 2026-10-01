// src/services/apiClient.ts
// HTTP client that talks to the backend REST API.
// In development, Vite proxies /api/* → http://localhost:5000
// In production, set VITE_API_URL in your hosting env.

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

// ─── Token storage ──────────────────────────────────────────────────────────

let _token: string | null = localStorage.getItem('boaive_token');

export const setAuthToken = (token: string | null) => {
  _token = token;
  if (token) {
    localStorage.setItem('boaive_token', token);
  } else {
    localStorage.removeItem('boaive_token');
  }
};

export const getAuthToken = () => _token;

// ─── Core fetch wrapper ─────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    setAuthToken(null);
    window.location.reload();
    throw new Error('Session expired. Please login again.');
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

// ─── Paginated list helper ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getAll = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T[]> => {
  const qs = new URLSearchParams();
  qs.set('limit', '200'); // fetch all for in-memory use (matching current frontend pattern)
  Object.entries(params).forEach(([k, v]) => qs.set(k, String(v)));
  const res = await api.get<PaginatedResponse<T>>(`${path}?${qs.toString()}`);
  return res.data;
};
