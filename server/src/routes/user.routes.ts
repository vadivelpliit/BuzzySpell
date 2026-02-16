import { Router, Request, Response } from 'express';
import {
  userQueries,
  spellingQueries,
  readingQueries,
  masteredWordsQueries,
  streakQueries,
  avatarQueries,
  wordAttemptsQueries,
} from '../database/db';
import {
  validateUserId,
  validateSpellingResult,
  validateReadingResult,
} from '../middleware/validation';

const router = Router();

// Create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, grade = 2 } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = userQueries.create.run(name, grade);
    const userId = (result as any).lastInsertRowid;
    
    // Initialize avatar
    avatarQueries.initialize.run(userId);
    
    const user = userQueries.getById.get(userId);
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = userQueries.getAll.all();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user progress
router.get('/:id/progress', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const grade = parseInt(req.query.grade as string) || 2;
    
    const spellingProgress = spellingQueries.getProgress.all(userId, grade);
    const readingProgress = readingQueries.getProgress.all(userId, grade);
    const highestLevel = spellingQueries.getHighestLevel.get(userId, grade) as any;
    const avatar = avatarQueries.get.get(userId);
    const currentStreak = streakQueries.getCurrentStreak.get(userId, userId) as any;
    
    res.json({
      spelling: spellingProgress,
      reading: readingProgress,
      highestLevel: highestLevel?.max_level || 0,
      avatar,
      currentStreak: currentStreak?.current_streak || 0,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Save spelling result
router.post('/:id/spelling-result', validateUserId, validateSpellingResult, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { grade, level, difficulty, score, total_words, passed, words_attempted } = req.body;
    
    // Save spelling progress
    spellingQueries.saveResult.run(userId, grade, level, difficulty, score, total_words, passed);
    
    // Update avatar XP
    const xpGained = score * 10;
    const avatar = avatarQueries.get.get(userId) as any;
    const newTotalXP = (avatar?.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const appearance = newLevel <= 3 ? 'baby' : newLevel <= 6 ? 'worker' : 'queen';
    
    avatarQueries.updateXP.run(xpGained, newLevel, appearance, userId);
    
    // Log word attempts for phonics tracking
    if (words_attempted && Array.isArray(words_attempted)) {
      for (const attempt of words_attempted) {
        wordAttemptsQueries.log.run(
          userId,
          attempt.word,
          attempt.user_input,
          attempt.correct,
          attempt.phonics_hint || null
        );
        
        // Add to mastered words if correct
        if (attempt.correct) {
          masteredWordsQueries.add.run(
            userId,
            attempt.word,
            attempt.definition || '',
            attempt.origin || '',
            attempt.phonics_pattern || ''
          );
        }
      }
    }
    
    // Update daily streak
    const today = new Date().toISOString().split('T')[0];
    streakQueries.updateStreak.run(userId, today, 5, 1); // 5 minutes per activity
    
    userQueries.updateLastActive.run(userId);
    
    res.json({ success: true, xpGained, newLevel, appearance });
  } catch (error) {
    console.error('Error saving spelling result:', error);
    res.status(500).json({ error: 'Failed to save spelling result' });
  }
});

// Save reading result
router.post('/:id/reading-result', validateUserId, validateReadingResult, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { grade, level, story_id, story_number, score, total_questions, passed } = req.body;
    
    // Save reading progress
    readingQueries.saveResult.run(userId, grade, level, story_id, story_number, score, total_questions, passed);
    
    // Update avatar XP
    const xpGained = score * 20;
    const avatar = avatarQueries.get.get(userId) as any;
    const newTotalXP = (avatar?.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const appearance = newLevel <= 3 ? 'baby' : newLevel <= 6 ? 'worker' : 'queen';
    
    avatarQueries.updateXP.run(xpGained, newLevel, appearance, userId);
    
    // Update daily streak
    const today = new Date().toISOString().split('T')[0];
    streakQueries.updateStreak.run(userId, today, 10, 1); // 10 minutes per story
    
    userQueries.updateLastActive.run(userId);
    
    res.json({ success: true, xpGained, newLevel, appearance });
  } catch (error) {
    console.error('Error saving reading result:', error);
    res.status(500).json({ error: 'Failed to save reading result' });
  }
});

// Get mastered words (Golden Hive)
router.get('/:id/golden-hive', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const words = masteredWordsQueries.getAll.all(userId);
    res.json({ words });
  } catch (error) {
    console.error('Error fetching golden hive:', error);
    res.status(500).json({ error: 'Failed to fetch golden hive' });
  }
});

// Update daily streak
router.post('/:id/streak', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { minutes, activities = 1 } = req.body;
    
    if (!minutes || minutes <= 0) {
      return res.status(400).json({ error: 'Invalid minutes value' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    streakQueries.updateStreak.run(userId, today, minutes, activities);
    
    const currentStreak = streakQueries.getCurrentStreak.get(userId, userId) as any;
    
    res.json({ success: true, currentStreak: currentStreak?.current_streak || 0 });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Get avatar state
router.get('/:id/avatar', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const avatar = avatarQueries.get.get(userId);
    res.json({ avatar });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    res.status(500).json({ error: 'Failed to fetch avatar' });
  }
});

// Update avatar state
router.put('/:id/avatar', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { accessories } = req.body;
    
    if (accessories) {
      avatarQueries.updateAccessories.run(JSON.stringify(accessories), userId);
    }
    
    const avatar = avatarQueries.get.get(userId);
    res.json({ avatar });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

export default router;
