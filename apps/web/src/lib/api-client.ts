import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial to send HttpOnly session JWT cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to manage global sessions (auto logout on 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.warn('[SESSION EXPIRED]: Redirecting user to authorization panel.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
