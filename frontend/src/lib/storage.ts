import { NEET_SYLLABUS } from '../data/neetSyllabus';
import type { Chapter } from '../data/neetSyllabus';

export interface ChapterWithRating extends Chapter {
  rating?: number;
  isCompleted?: boolean;
  isRevised?: boolean;
}

export type ExtendedSyllabus = Record<'Physics' | 'Chemistry' | 'Biology', ChapterWithRating[]>;

export interface ChapterCheckState {
  completed: boolean;
  revised: boolean;
}

export interface CheckInOutRecord {
  id: number;
  date: string;
  checkInTimestamp: number;
  checkInTime: string;
  checkOutTimestamp: number | null;
  checkOutTime: string | null;
  isOnBreak: boolean;
  currentBreakStartTime: number | null;
  totalBreakSeconds: number;
  totalDurationHours: number;
  mood: string;
  reflection: string;
}

export interface BackupData {
  version: string;
  timestamp: string;
  studentName: string;
  attendance: CheckInOutRecord[];
  ncertChecklist: Record<number, ChapterCheckState>;
  customSyllabus: ExtendedSyllabus;
  chapterNotes: Record<number, string>;
  mockTests: any[];
  parentNotes: any[];
}

// 1. Clean Initial Syllabus for New User (0% completed, clean starting state)
export const getCleanInitialSyllabus = (): ExtendedSyllabus => {
  const clean: ExtendedSyllabus = { Physics: [], Chemistry: [], Biology: [] };
  (['Physics', 'Chemistry', 'Biology'] as const).forEach(subj => {
    clean[subj] = NEET_SYLLABUS[subj].map(ch => ({
      ...ch,
      rating: 0,
      isCompleted: false,
      isRevised: false,
      topics: ch.topics.map(t => ({
        ...t,
        status: 'Not Started' as const,
        confidence: 0,
        lastStudied: null,
      })),
    }));
  });
  return clean;
};

// 2. Clean Initial NCERT Checklist (0/79 completed)
export const getCleanInitialChecklist = (): Record<number, ChapterCheckState> => {
  const initial: Record<number, ChapterCheckState> = {};
  (['Physics', 'Chemistry', 'Biology'] as const).forEach(subj => {
    NEET_SYLLABUS[subj].forEach(ch => {
      initial[ch.id] = { completed: false, revised: false };
    });
  });
  return initial;
};

// 3. Safe LocalStorage with Rolling Backup Snapshots
export const safeStorage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Storage read error for ${key}, using fallback:`, e);
      return fallback;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);

      // Create a background snapshot backup in localStorage
      const backupKey = `neet_snapshot_${key}`;
      localStorage.setItem(backupKey, serialized);
      localStorage.setItem('neet_last_backup_timestamp', new Date().toISOString());
    } catch (e) {
      console.error(`Storage write error for ${key}:`, e);
    }
  },

  // Export 100% of study data as a downloadable JSON file
  exportBackup: (): void => {
    const backup: BackupData = {
      version: '2027.1',
      timestamp: new Date().toISOString(),
      studentName: 'Akarsh Singh',
      attendance: safeStorage.get('neet_attendance_records', []),
      ncertChecklist: safeStorage.get('neet_ncert_chapter_checklist', getCleanInitialChecklist()),
      customSyllabus: safeStorage.get('neet_custom_syllabus_v3', getCleanInitialSyllabus()),
      chapterNotes: safeStorage.get('neet_ncert_chapter_notes', {}),
      mockTests: safeStorage.get('neet_mock_tests_list', []),
      parentNotes: safeStorage.get('neet_parent_encouragement_notes', []),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeetTracker_Backup_AkarshSingh_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import / Restore backup file
  importBackup: (jsonString: string): boolean => {
    try {
      const parsed: BackupData = JSON.parse(jsonString);
      if (parsed.attendance) localStorage.setItem('neet_attendance_records', JSON.stringify(parsed.attendance));
      if (parsed.ncertChecklist) localStorage.setItem('neet_ncert_chapter_checklist', JSON.stringify(parsed.ncertChecklist));
      if (parsed.customSyllabus) localStorage.setItem('neet_custom_syllabus_v3', JSON.stringify(parsed.customSyllabus));
      if (parsed.chapterNotes) localStorage.setItem('neet_ncert_chapter_notes', JSON.stringify(parsed.chapterNotes));
      if (parsed.mockTests) localStorage.setItem('neet_mock_tests_list', JSON.stringify(parsed.mockTests));
      if (parsed.parentNotes) localStorage.setItem('neet_parent_encouragement_notes', JSON.stringify(parsed.parentNotes));
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  },

  // Total Reset to Fresh State
  resetAllToCleanSlate: (): void => {
    localStorage.removeItem('neet_attendance_records');
    localStorage.removeItem('neet_ncert_chapter_checklist');
    localStorage.removeItem('neet_custom_syllabus_v2');
    localStorage.removeItem('neet_custom_syllabus_v3');
    localStorage.removeItem('neet_mock_tests_list');
    localStorage.removeItem('neet_leetcode_heatmap');
    localStorage.removeItem('neet_personal_study_notes');
    localStorage.removeItem('neet_parent_encouragement_notes');

    // Initialize fresh 0% data
    safeStorage.set('neet_attendance_records', []);
    safeStorage.set('neet_ncert_chapter_checklist', getCleanInitialChecklist());
    safeStorage.set('neet_custom_syllabus_v3', getCleanInitialSyllabus());
  }
};
