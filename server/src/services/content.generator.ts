import openaiService, { SpellingWord, Story } from './openai.service';
import { contentCacheQueries } from '../database/db';

export class ContentGenerator {
  async getSpellingWords(grade: number, level: number): Promise<SpellingWord[]> {
    // Check cache first
    const cached = contentCacheQueries.get.get('spelling_words', grade, level) as any;
    
    if (cached) {
      console.log(`Using cached spelling words for grade ${grade}, level ${level}`);
      return JSON.parse(cached.content_json);
    }

    // Generate new content
    console.log(`Generating new spelling words for grade ${grade}, level ${level}`);
    const words = await openaiService.generateSpellingWords(grade, level);
    
    // Cache the result
    contentCacheQueries.set.run(
      'spelling_words',
      grade,
      level,
      JSON.stringify(words)
    );
    
    return words;
  }

  async getStoryPack(grade: number, level: number): Promise<Story[]> {
    // Check cache first
    const cached = contentCacheQueries.get.get('story_pack', grade, level) as any;
    
    if (cached) {
      console.log(`Using cached story pack for grade ${grade}, level ${level}`);
      return JSON.parse(cached.content_json);
    }

    // Generate new content
    console.log(`Generating new story pack for grade ${grade}, level ${level}`);
    const stories = await openaiService.generateStoryPack(grade, level);
    
    // Cache the result
    contentCacheQueries.set.run(
      'story_pack',
      grade,
      level,
      JSON.stringify(stories)
    );
    
    return stories;
  }

  async preGenerateContent(grade: number, maxLevel: number = 10): Promise<void> {
    console.log(`Pre-generating content for grade ${grade}, levels 1-${maxLevel}...`);
    
    for (let level = 1; level <= maxLevel; level++) {
      try {
        await this.getSpellingWords(grade, level);
        await this.getStoryPack(grade, level);
        console.log(`✓ Completed grade ${grade}, level ${level}`);
      } catch (error) {
        console.error(`✗ Failed to generate content for grade ${grade}, level ${level}:`, error);
      }
    }
    
    console.log('Pre-generation complete!');
  }
}

export default new ContentGenerator();
