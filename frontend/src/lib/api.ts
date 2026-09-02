import axios from 'axios';

// Automatically uses environment variable in production (e.g. on Vercel/Netlify) or defaults to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const isAuth = localStorage.getItem('neet_is_authenticated');
  const mode = localStorage.getItem('neet_access_mode');
  if (isAuth === 'true') {
    config.headers['x-access-code'] = mode === 'edit' ? '2027' : '9999';
  }
  if (mode) {
    config.headers['x-access-mode'] = mode;
  }
  return config;
});

export const authAPI = {
  login: async (code: string, selectedMode?: string) => {
    try {
      const res = await api.post('/auth/login', { code, mode: selectedMode });
      return res.data;
    } catch {
      // Fallback for offline/mock mode
      const trimmed = code.trim().toLowerCase();
      const validStudent = ['2027', 'akarsh2027', 'akarsh'];
      const validParent = ['9999', 'parent2027', 'parent', '1234'];
      const isSuccess = selectedMode === 'edit' ? validStudent.includes(trimmed) : validParent.includes(trimmed);
      return { success: isSuccess };
    }
  },
};

export default api;
