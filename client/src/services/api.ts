import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: number;
  name: string;
  grade: number;
  created_at: string;
  last_active: string;
}

export interface SpellingWord {
  word: string;
  definition: string;
  origin: string;
  phonics_pattern: string;
  difficulty: number;
  example_sentence: string;
}

export interface Story {
  id: string;
  title: string;
  text: string;
  word_count: number;
  difficulty_level: string;
  themes: string[];
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Avatar {
  id: number;
  user_id: number;
  current_level: number;
  total_xp: number;
  appearance: 'baby' | 'worker' | 'queen';
  accessories: string[];
  updated_at: string;
}

export interface MasteredWord {
  id: number;
  user_id: number;
  word: string;
  definition: string;
  origin: string;
  phonics_pattern: string;
  times_spelled_correctly: number;
  used_in_dictation: boolean;
  last_reviewed: string;
  mastered_at: string;
}

// User APIs
export const userApi = {
  create: async (name: string, grade: number = 2): Promise<User> => {
    const response = await api.post('/user', { name, grade });
    return response.data.user;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get('/user');
    return response.data.users;
  },

  getProgress: async (userId: number, grade: number = 2) => {
    const response = await api.get(`/user/${userId}/progress`, { params: { grade } });
    return response.data;
  },

  saveSpellingResult: async (userId: number, data: {
    grade: number;
    level: number;
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    total_words: number;
    passed: boolean;
    words_attempted?: any[];
  }) => {
    const response = await api.post(`/user/${userId}/spelling-result`, data);
    return response.data;
  },

  saveReadingResult: async (userId: number, data: {
    grade: number;
    level: number;
    story_id: string;
    story_number: number;
    score: number;
    total_questions: number;
    passed: boolean;
  }) => {
    const response = await api.post(`/user/${userId}/reading-result`, data);
    return response.data;
  },

  getGoldenHive: async (userId: number): Promise<MasteredWord[]> => {
    const response = await api.get(`/user/${userId}/golden-hive`);
    return response.data.words;
  },

  updateStreak: async (userId: number, minutes: number, activities: number = 1) => {
    const response = await api.post(`/user/${userId}/streak`, { minutes, activities });
    return response.data;
  },

  getAvatar: async (userId: number): Promise<Avatar> => {
    const response = await api.get(`/user/${userId}/avatar`);
    return response.data.avatar;
  },

  updateAvatar: async (userId: number, accessories: string[]) => {
    const response = await api.put(`/user/${userId}/avatar`, { accessories });
    return response.data.avatar;
  },
};

// Content APIs
export const contentApi = {
  getSpellingWords: async (grade: number, level: number): Promise<SpellingWord[]> => {
    const response = await api.post('/content/spelling-words', { grade, level });
    return response.data.words;
  },

  getStoryPack: async (grade: number, level: number): Promise<Story[]> => {
    const response = await api.post('/content/story-pack', { grade, level });
    return response.data.stories;
  },
};

export default api;
