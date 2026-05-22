import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { formatApiError } from '../utils/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/v1', '') 
  : 'http://localhost:5000/api';

/**
 * Reusable Central Axios API Client
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s request timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple local cache store for GET requests to prevent repeated refetches
const responseCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Request Interceptor for Logging and Debugging
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ➔ ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    
    // Support lightweight frontend caching strategy for GET requests
    if (config.method === 'get' && config.url) {
      const cacheKey = `${config.url}?${JSON.stringify(config.params || '')}`;
      const cached = responseCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          } as AxiosResponse);
        };
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor for Centralized Error Handling, Retries, and Cache Population
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Success] ${response.config.method?.toUpperCase()} ➔ ${response.config.url}`, response.data);
    }

    // Populate local cache for successful GET responses
    if (response.config.method === 'get' && response.config.url && response.status === 200) {
      const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params || '')}`;
      responseCache.set(cacheKey, {
        data: response.data,
        expiry: Date.now() + CACHE_TTL,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Failure] ${config?.method?.toUpperCase()} ➔ ${config?.url}`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Centralized Retry Strategy for Temporary API Failures
    const isRetryable = error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500;
    const retryCount = (config as any)?._retryCount || 0;
    
    if (config && isRetryable && retryCount < 2) {
      (config as any)._retryCount = retryCount + 1;
      const backoffDelay = (retryCount + 1) * 1000;
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Retrying request ${config.url} (${retryCount + 1}/2) after ${backoffDelay}ms...`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return apiClient(config);
    }

    // Format central message payload to throw
    const formattedMsg = formatApiError(error);
    const parsedError = new Error(formattedMsg);
    (parsedError as any).status = error.response?.status;
    (parsedError as any).errors = (error.response?.data as any)?.errors;

    return Promise.reject(parsedError);
  }
);

/**
 * Clear local request cache manually (e.g. after mutations like POST, PUT, DELETE)
 */
export const invalidateApiCache = () => {
  responseCache.clear();
};

export default apiClient;
