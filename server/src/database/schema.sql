-- Users table for student profiles
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL DEFAULT 2,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Spelling progress tracking
CREATE TABLE IF NOT EXISTS spelling_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  level INTEGER NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  score INTEGER NOT NULL,
  total_words INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mastered words for The Golden Hive
CREATE TABLE IF NOT EXISTS mastered_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  definition TEXT,
  origin TEXT,
  phonics_pattern TEXT,
  times_spelled_correctly INTEGER DEFAULT 0,
  used_in_dictation BOOLEAN DEFAULT FALSE,
  last_reviewed DATETIME DEFAULT CURRENT_TIMESTAMP,
  mastered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, word)
);

-- Reading comprehension progress
CREATE TABLE IF NOT EXISTS reading_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  level INTEGER NOT NULL,
  story_id TEXT NOT NULL,
  story_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily streaks tracking
CREATE TABLE IF NOT EXISTS daily_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  streak_date DATE NOT NULL,
  minutes_practiced INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, streak_date)
);

-- Avatar state for bee character
CREATE TABLE IF NOT EXISTS avatar_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  appearance TEXT DEFAULT 'baby',
  accessories TEXT DEFAULT '[]',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Generated content cache (word lists and stories)
CREATE TABLE IF NOT EXISTS content_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT CHECK(content_type IN ('spelling_words', 'story_pack')) NOT NULL,
  grade INTEGER NOT NULL,
  level INTEGER NOT NULL,
  content_json TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_type, grade, level)
);

-- Word attempt tracking for phonics feedback
CREATE TABLE IF NOT EXISTS word_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  user_input TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  phonics_hint TEXT,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spelling_progress_user ON spelling_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_streaks_user_date ON daily_streaks(user_id, streak_date);
CREATE INDEX IF NOT EXISTS idx_mastered_words_user ON mastered_words(user_id);
