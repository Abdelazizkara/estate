import axios from 'axios';

/** Remove legacy token storage from localStorage (pre-cookie auth). */
export function clearLegacyAuthStorage() {
  localStorage.removeItem('estate-token');
  try {
    const raw = localStorage.getItem('user-store');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      if (parsed?.state?.token) {
        delete parsed.state.token;
        localStorage.setItem('user-store', JSON.stringify(parsed));
      }
    }
  } catch {
    /* ignore */
  }
}

// Use relative URLs (e.g. /api/properties) so Vite proxy can route to the backend.
// If VITE_API_URL is set, axios will bypass the proxy.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});


clearLegacyAuthStorage();

// Debug: help diagnose 502s by surfacing the actual baseURL used by axios
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('API error', {
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
    }
    return Promise.reject(err);
  }
);

