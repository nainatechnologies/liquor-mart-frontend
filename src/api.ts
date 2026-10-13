const getHost = () => typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_ROOT = import.meta.env.VITE_API_BASE || `http://${getHost()}:5000`;
export const BASE_URL = import.meta.env.VITE_API_URL || `${API_ROOT}/api`;

// Helper to get auth token if you are storing it in localStorage
const getAuthToken = () => localStorage.getItem('token');

interface ApiOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;
  const token = getAuthToken();

  const config: RequestInit = {
    ...customConfig,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (data) {
    if (data instanceof FormData) {
      config.body = data;
      // Delete Content-Type so browser sets boundary for multipart
      delete (config.headers as Record<string, string>)['Content-Type'];
    } else {
      config.body = JSON.stringify(data);
    }
  }

  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error(`API Error on ${normalizedEndpoint}:`, error);
    throw error;
  }
}

export const api = {
  /**
   * Core request function
   */
  request,

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: ApiOptions) {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any, options?: ApiOptions) {
    return request<T>(endpoint, { ...options, method: 'POST', data });
  },

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any, options?: ApiOptions) {
    return request<T>(endpoint, { ...options, method: 'PUT', data });
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: ApiOptions) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
