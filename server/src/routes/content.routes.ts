import { Router, Request, Response } from 'express';
import contentGenerator from '../services/content.generator';
import { validateGradeLevel } from '../middleware/validation';
import { contentGenerationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Generate spelling words
router.post('/spelling-words', contentGenerationLimiter, validateGradeLevel, async (req: Request, res: Response) => {
  try {
    const { grade, level } = req.body;
    const words = await contentGenerator.getSpellingWords(grade, level);
    res.json({ words });
  } catch (error) {
    console.error('Error fetching spelling words:', error);
    res.status(500).json({ error: 'Failed to generate spelling words' });
  }
});

// Generate story pack
router.post('/story-pack', contentGenerationLimiter, validateGradeLevel, async (req: Request, res: Response) => {
  try {
    const { grade, level } = req.body;
    const stories = await contentGenerator.getStoryPack(grade, level);
    res.json({ stories });
  } catch (error) {
    console.error('Error fetching story pack:', error);
    res.status(500).json({ error: 'Failed to generate story pack' });
  }
});

export default router;
