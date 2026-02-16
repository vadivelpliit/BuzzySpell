import { Request, Response, NextFunction } from 'express';

export function validateUserId(req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  req.params.id = userId.toString();
  next();
}

export function validateGradeLevel(req: Request, res: Response, next: NextFunction) {
  const { grade, level } = req.body;
  
  if (!grade || !level) {
    return res.status(400).json({ error: 'Grade and level are required' });
  }
  
  if (isNaN(grade) || isNaN(level) || grade < 1 || grade > 12 || level < 1 || level > 10) {
    return res.status(400).json({ error: 'Invalid grade or level' });
  }
  
  next();
}

export function validateSpellingResult(req: Request, res: Response, next: NextFunction) {
  const { grade, level, difficulty, score, total_words, passed } = req.body;
  
  if (!grade || !level || !difficulty || score === undefined || !total_words || passed === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty level' });
  }
  
  if (score < 0 || score > total_words) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  
  next();
}

export function validateReadingResult(req: Request, res: Response, next: NextFunction) {
  const { grade, level, story_id, story_number, score, total_questions, passed } = req.body;
  
  if (!grade || !level || !story_id || !story_number || score === undefined || !total_questions || passed === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (score < 0 || score > total_questions) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  
  next();
}
