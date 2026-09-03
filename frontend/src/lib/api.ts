import axios from 'axios';

// Connects to live backend or localhost with dynamic fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:3000' 
    : 'https://neet-tracke.vercel.app');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// 1. Health & Server Connection Check
export const healthAPI = {
  check: async () => {
    try {
      const res = await api.get('/health');
      return { connected: true, data: res.data };
    } catch {
      return { connected: false, data: null };
    }
  },
};

// 2. Authentication API
export const authAPI = {
  login: async (code: string, selectedMode?: string) => {
    try {
      const res = await api.post('/auth/login', { code, mode: selectedMode });
      return res.data;
    } catch {
      // Offline fallback
      const trimmed = code.trim().toLowerCase();
      const validStudent = ['2027', 'akarsh2027', 'akarsh'];
      const validParent = ['9999', 'parent2027', 'parent', '1234'];
      const isSuccess = selectedMode === 'edit' ? validStudent.includes(trimmed) : validParent.includes(trimmed);
      return { success: isSuccess };
    }
  },
};

// 3. Dashboard Analytics API
export const dashboardAPI = {
  getSummary: async () => {
    try {
      const res = await api.get('/dashboard');
      return res.data;
    } catch {
      return null;
    }
  },
};

// 4. Daily Attendance & Logs API
export const attendanceAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/daily-logs');
      return res.data;
    } catch {
      return [];
    }
  },
  getToday: async () => {
    try {
      const res = await api.get('/daily-logs/today');
      return res.data;
    } catch {
      return null;
    }
  },
  createOrUpdate: async (data: {
    date: string;
    hoursStudied?: number;
    notes?: string;
    checkInTime?: string;
    checkInTimestamp?: number;
    checkOutTime?: string | null;
    checkOutTimestamp?: number | null;
    isOnBreak?: boolean;
    currentBreakStartTime?: number | null;
    totalBreakSeconds?: number;
    totalDurationHours?: number;
    mood?: string;
    reflection?: string;
    checkInPhoto?: string;
  }) => {
    try {
      const res = await api.post('/daily-logs', data);
      return res.data;
    } catch (e) {
      console.warn('Backend sync failed, stored in safe local vault:', e);
      return null;
    }
  },
  getStreak: async () => {
    try {
      const res = await api.get('/daily-logs/streak');
      return res.data;
    } catch {
      return 0;
    }
  },
  getHeatmap: async () => {
    try {
      const res = await api.get('/daily-logs/heatmap');
      return res.data;
    } catch {
      return [];
    }
  },
};

// 5. Syllabus & NCERT Chapters API
export const syllabusAPI = {
  getSubjects: async () => {
    try {
      const res = await api.get('/subjects');
      return res.data;
    } catch {
      return [];
    }
  },
  getChapters: async (subjectId?: number) => {
    try {
      const res = await api.get(subjectId ? `/chapters?subjectId=${subjectId}` : '/chapters');
      return res.data;
    } catch {
      return [];
    }
  },
  bulkSyncChapters: async (chapters: Array<{ id?: number; name?: string; rating?: number; isCompleted?: boolean; isRevised?: boolean; notes?: string }>) => {
    try {
      const res = await api.post('/chapters/bulk-sync', chapters);
      return res.data;
    } catch {
      return null;
    }
  },
  updateChapter: async (id: number, data: { rating?: number; isCompleted?: boolean; isRevised?: boolean; notes?: string }) => {
    try {
      const res = await api.patch(`/chapters/${id}`, data);
      return res.data;
    } catch {
      return null;
    }
  },
  updateTopicStatus: async (topicId: number, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISED', confidence?: number) => {
    try {
      const res = await api.patch(`/topics/${topicId}`, { status, confidence });
      return res.data;
    } catch {
      return null;
    }
  },
};

// 6. Mock Tests & Performance API
export const testsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/tests');
      return res.data;
    } catch {
      return [];
    }
  },
  create: async (data: any) => {
    try {
      const res = await api.post('/tests', data);
      return res.data;
    } catch {
      return null;
    }
  },
};

// 7. Family Parent Encouragement Notes API
export const parentNotesAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/parent-notes');
      return res.data;
    } catch {
      return [];
    }
  },
  create: async (data: { author?: string; message: string }) => {
    try {
      const res = await api.post('/parent-notes', data);
      return res.data;
    } catch {
      return null;
    }
  },
};

// 8. Flashcards Revision Deck API
export const flashcardsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/flashcards');
      return res.data;
    } catch {
      return [];
    }
  },
  getDue: async () => {
    try {
      const res = await api.get('/flashcards/due');
      return res.data;
    } catch {
      return [];
    }
  },
  create: async (data: { topicId: number; frontContent: string; backContent: string }) => {
    try {
      const res = await api.post('/flashcards', data);
      return res.data;
    } catch {
      return null;
    }
  },
  review: async (id: number, quality: number) => {
    try {
      const res = await api.post(`/flashcards/${id}/review`, { quality });
      return res.data;
    } catch {
      return null;
    }
  },
};

export default api;
