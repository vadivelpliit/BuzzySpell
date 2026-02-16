import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export class OpenAIService {
  async generateSpellingWords(grade: number, level: number): Promise<SpellingWord[]> {
    const prompt = this.buildSpellingPrompt(grade, level);
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert elementary school teacher specializing in spelling bee preparation. Generate age-appropriate spelling words with educational value.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content received from OpenAI');
      
      const result = JSON.parse(content);
      return result.words;
    } catch (error) {
      console.error('Error generating spelling words:', error);
      throw new Error('Failed to generate spelling words');
    }
  }

  async generateStoryPack(grade: number, level: number): Promise<Story[]> {
    const prompt = this.buildStoryPrompt(grade, level);
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert children\'s author and educator. Create engaging, age-appropriate stories with comprehension questions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content received from OpenAI');
      
      const result = JSON.parse(content);
      return result.stories;
    } catch (error) {
      console.error('Error generating story pack:', error);
      throw new Error('Failed to generate story pack');
    }
  }

  private buildSpellingPrompt(grade: number, level: number): string {
    const difficulty = this.calculateDifficulty(level);
    
    return `Generate exactly 20 spelling words for grade ${grade}, level ${level} (difficulty: ${difficulty}).

Requirements:
- Words should be age-appropriate for ${grade}nd grade
- Include common phonics patterns relevant to this level
- Difficulty range: ${difficulty}/10
- Each word must include: word, definition, origin, phonics_pattern, difficulty (1-10), example_sentence

Phonics patterns to focus on for level ${level}:
${this.getPhonicsPatterns(level)}

Return a JSON object with this structure:
{
  "words": [
    {
      "word": "example",
      "definition": "a thing characteristic of its kind",
      "origin": "Latin 'exemplum'",
      "phonics_pattern": "ex-am-ple (short e, short a, silent e)",
      "difficulty": 5,
      "example_sentence": "The teacher gave an example of a compound word."
    }
  ]
}`;
  }

  private buildStoryPrompt(grade: number, level: number): string {
    const wordCount = this.getStoryWordCount(level);
    const complexity = this.getStoryComplexity(level);
    
    return `Generate 5 engaging stories for ${grade}nd grade students, level ${level}.

Requirements:
- Each story should be ${wordCount.min}-${wordCount.max} words
- Complexity: ${complexity}
- Include 3-5 comprehension questions per story
- Questions should test: ${this.getQuestionTypes(level)}
- Stories should have moral lessons and educational value
- Use vocabulary appropriate for ${grade}nd grade

Story themes to include (one per story):
1. Friendship and cooperation
2. Overcoming challenges
3. Honesty and integrity
4. Curiosity and learning
5. Kindness and empathy

Return a JSON object with this structure:
{
  "stories": [
    {
      "id": "story_1",
      "title": "The Story Title",
      "text": "Full story text here...",
      "word_count": 150,
      "difficulty_level": "beginner",
      "themes": ["friendship"],
      "questions": [
        {
          "question": "What was the main character's problem?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": 0,
          "explanation": "The story clearly states..."
        }
      ]
    }
  ]
}`;
  }

  private calculateDifficulty(level: number): number {
    return Math.min(Math.ceil(level * 0.7) + 2, 10);
  }

  private getPhonicsPatterns(level: number): string {
    const patterns = [
      ['CVC words (cat, dog)', 'short vowels', 'consonant blends (st, br, fl)'],
      ['CVCe words (cake, time)', 'long vowels with silent e', 'digraphs (ch, sh, th)'],
      ['vowel teams (ai, ea, oa)', 'r-controlled vowels (ar, er, ir)', 'diphthongs (oi, ou)'],
      ['silent letters (kn, wr, mb)', 'complex blends (scr, spl)', 'suffix patterns (-ing, -ed)'],
      ['vowel combinations (ie, igh, eigh)', 'prefix patterns (un-, re-)', 'compound words'],
      ['advanced suffixes (-tion, -sion)', 'Greek/Latin roots', 'homophones'],
      ['multi-syllable words', 'schwa sounds', 'advanced prefixes (pre-, dis-)'],
      ['irregular spellings', 'word families', 'advanced vocabulary'],
      ['complex word structures', 'etymology-based patterns', 'academic vocabulary'],
      ['contest-level words', 'rare patterns', 'advanced etymology'],
    ];
    
    return patterns[Math.min(level - 1, patterns.length - 1)].join(', ');
  }

  private getStoryWordCount(level: number): { min: number; max: number } {
    if (level <= 3) return { min: 100, max: 150 };
    if (level <= 7) return { min: 200, max: 300 };
    return { min: 300, max: 500 };
  }

  private getStoryComplexity(level: number): string {
    if (level <= 3) return 'Simple sentences, clear cause-and-effect, literal comprehension';
    if (level <= 7) return 'Varied sentence structure, some inference required, character motivations';
    return 'Complex narratives, multiple themes, advanced vocabulary, abstract concepts';
  }

  private getQuestionTypes(level: number): string {
    if (level <= 3) return 'literal recall, main idea, sequence of events';
    if (level <= 7) return 'inference, character analysis, cause and effect, vocabulary in context';
    return 'theme identification, author\'s purpose, figurative language, complex inference';
  }
}

export default new OpenAIService();
