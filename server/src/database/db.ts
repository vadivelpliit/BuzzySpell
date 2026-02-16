import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './data/spelling_bee.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run migrations
export function runMigrations() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Database migrations completed successfully');
}

// User operations
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (name, grade) VALUES (?, ?)
  `),
  
  getById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),
  
  getAll: db.prepare(`
    SELECT * FROM users ORDER BY created_at DESC
  `),
  
  updateLastActive: db.prepare(`
    UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?
  `),
};

// Spelling progress operations
export const spellingQueries = {
  saveResult: db.prepare(`
    INSERT INTO spelling_progress (user_id, grade, level, difficulty, score, total_words, passed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  getProgress: db.prepare(`
    SELECT * FROM spelling_progress 
    WHERE user_id = ? AND grade = ? 
    ORDER BY level DESC, completed_at DESC
  `),
  
  getHighestLevel: db.prepare(`
    SELECT MAX(level) as max_level FROM spelling_progress 
    WHERE user_id = ? AND grade = ? AND passed = 1
  `),
};

// Mastered words operations
export const masteredWordsQueries = {
  add: db.prepare(`
    INSERT INTO mastered_words (user_id, word, definition, origin, phonics_pattern)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, word) DO UPDATE SET
      times_spelled_correctly = times_spelled_correctly + 1,
      last_reviewed = CURRENT_TIMESTAMP
  `),
  
  getAll: db.prepare(`
    SELECT * FROM mastered_words WHERE user_id = ? ORDER BY mastered_at DESC
  `),
  
  updateStats: db.prepare(`
    UPDATE mastered_words 
    SET times_spelled_correctly = times_spelled_correctly + 1,
        last_reviewed = CURRENT_TIMESTAMP
    WHERE user_id = ? AND word = ?
  `),
  
  markUsedInDictation: db.prepare(`
    UPDATE mastered_words SET used_in_dictation = 1 WHERE user_id = ? AND word = ?
  `),
};

// Reading progress operations
export const readingQueries = {
  saveResult: db.prepare(`
    INSERT INTO reading_progress (user_id, grade, level, story_id, story_number, score, total_questions, passed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getProgress: db.prepare(`
    SELECT * FROM reading_progress 
    WHERE user_id = ? AND grade = ? 
    ORDER BY level DESC, story_number DESC, completed_at DESC
  `),
  
  getCompletedStories: db.prepare(`
    SELECT story_id FROM reading_progress 
    WHERE user_id = ? AND grade = ? AND level = ? AND passed = 1
  `),
};

// Daily streaks operations
export const streakQueries = {
  updateStreak: db.prepare(`
    INSERT INTO daily_streaks (user_id, streak_date, minutes_practiced, activities_completed)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, streak_date) DO UPDATE SET
      minutes_practiced = minutes_practiced + excluded.minutes_practiced,
      activities_completed = activities_completed + excluded.activities_completed
  `),
  
  getStreak: db.prepare(`
    SELECT * FROM daily_streaks 
    WHERE user_id = ? 
    ORDER BY streak_date DESC 
    LIMIT 30
  `),
  
  getCurrentStreak: db.prepare(`
    WITH RECURSIVE streak_calc AS (
      SELECT 
        streak_date,
        minutes_practiced,
        1 as streak_length
      FROM daily_streaks
      WHERE user_id = ? AND streak_date = DATE('now')
      
      UNION ALL
      
      SELECT 
        ds.streak_date,
        ds.minutes_practiced,
        sc.streak_length + 1
      FROM daily_streaks ds
      INNER JOIN streak_calc sc ON ds.streak_date = DATE(sc.streak_date, '-1 day')
      WHERE ds.user_id = ? AND ds.minutes_practiced >= 15
    )
    SELECT MAX(streak_length) as current_streak FROM streak_calc
  `),
};

// Avatar operations
export const avatarQueries = {
  initialize: db.prepare(`
    INSERT INTO avatar_state (user_id, current_level, total_xp, appearance)
    VALUES (?, 1, 0, 'baby')
    ON CONFLICT(user_id) DO NOTHING
  `),
  
  get: db.prepare(`
    SELECT * FROM avatar_state WHERE user_id = ?
  `),
  
  updateXP: db.prepare(`
    UPDATE avatar_state 
    SET total_xp = total_xp + ?,
        current_level = ?,
        appearance = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `),
  
  updateAccessories: db.prepare(`
    UPDATE avatar_state 
    SET accessories = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `),
};

// Content cache operations
export const contentCacheQueries = {
  get: db.prepare(`
    SELECT content_json FROM content_cache 
    WHERE content_type = ? AND grade = ? AND level = ?
  `),
  
  set: db.prepare(`
    INSERT INTO content_cache (content_type, grade, level, content_json)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(content_type, grade, level) DO UPDATE SET
      content_json = excluded.content_json,
      created_at = CURRENT_TIMESTAMP
  `),
};

// Word attempts operations
export const wordAttemptsQueries = {
  log: db.prepare(`
    INSERT INTO word_attempts (user_id, word, user_input, correct, phonics_hint)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  getHistory: db.prepare(`
    SELECT * FROM word_attempts 
    WHERE user_id = ? AND word = ? 
    ORDER BY attempted_at DESC 
    LIMIT 10
  `),
};

export default db;
