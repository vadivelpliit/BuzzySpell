// Phonics rules engine for spelling feedback

export interface PhonicsRule {
  pattern: string;
  explanation: string;
  examples: string[];
}

export const phonicsRules: Record<string, PhonicsRule> = {
  // Vowel teams
  'ai': {
    pattern: 'ai',
    explanation: 'The "ai" team makes the long A sound (like in "rain")',
    examples: ['rain', 'train', 'paint', 'wait'],
  },
  'ay': {
    pattern: 'ay',
    explanation: 'The "ay" team makes the long A sound at the end of words',
    examples: ['day', 'play', 'stay', 'away'],
  },
  'ea': {
    pattern: 'ea',
    explanation: 'The "ea" team usually makes the long E sound',
    examples: ['eat', 'seat', 'teach', 'beach'],
  },
  'ee': {
    pattern: 'ee',
    explanation: 'The "ee" team makes the long E sound',
    examples: ['bee', 'tree', 'seed', 'feet'],
  },
  'oa': {
    pattern: 'oa',
    explanation: 'The "oa" team makes the long O sound',
    examples: ['boat', 'coat', 'road', 'soap'],
  },
  'ow': {
    pattern: 'ow',
    explanation: 'The "ow" team can make the long O sound or the "ow" sound',
    examples: ['snow', 'grow', 'cow', 'now'],
  },
  
  // Silent letters
  'silent_e': {
    pattern: '_e',
    explanation: 'The silent E at the end makes the vowel say its name',
    examples: ['cake', 'time', 'hope', 'cube'],
  },
  'kn': {
    pattern: 'kn',
    explanation: 'In "kn" words, the K is silent',
    examples: ['knee', 'know', 'knife', 'knock'],
  },
  'wr': {
    pattern: 'wr',
    explanation: 'In "wr" words, the W is silent',
    examples: ['write', 'wrong', 'wrap', 'wrench'],
  },
  'mb': {
    pattern: 'mb',
    explanation: 'In "mb" at the end, the B is silent',
    examples: ['climb', 'thumb', 'lamb', 'comb'],
  },
  'gh': {
    pattern: 'gh',
    explanation: 'The "gh" is often silent or makes an F sound',
    examples: ['night', 'light', 'laugh', 'rough'],
  },
  
  // Digraphs
  'ch': {
    pattern: 'ch',
    explanation: 'The "ch" team makes the /ch/ sound',
    examples: ['chair', 'church', 'much', 'lunch'],
  },
  'sh': {
    pattern: 'sh',
    explanation: 'The "sh" team makes the /sh/ sound',
    examples: ['ship', 'fish', 'wash', 'brush'],
  },
  'th': {
    pattern: 'th',
    explanation: 'The "th" team makes the /th/ sound',
    examples: ['this', 'that', 'think', 'both'],
  },
  'ph': {
    pattern: 'ph',
    explanation: 'The "ph" team makes the /f/ sound',
    examples: ['phone', 'graph', 'photo', 'elephant'],
  },
  
  // Special patterns
  'igh': {
    pattern: 'igh',
    explanation: 'The "igh" team makes the long I sound (the GH is silent)',
    examples: ['night', 'light', 'right', 'bright'],
  },
  'oi': {
    pattern: 'oi',
    explanation: 'The "oi" team makes the /oy/ sound in the middle of words',
    examples: ['coin', 'point', 'join', 'oil'],
  },
  'oy': {
    pattern: 'oy',
    explanation: 'The "oy" team makes the /oy/ sound at the end of words',
    examples: ['boy', 'toy', 'joy', 'enjoy'],
  },
  'ou': {
    pattern: 'ou',
    explanation: 'The "ou" team can make different sounds',
    examples: ['out', 'house', 'you', 'soup'],
  },
  'ar': {
    pattern: 'ar',
    explanation: 'The "ar" team makes the /ar/ sound like in "car"',
    examples: ['car', 'star', 'farm', 'park'],
  },
  'er': {
    pattern: 'er',
    explanation: 'The "er" team makes the /er/ sound',
    examples: ['her', 'verb', 'fern', 'teacher'],
  },
  'ir': {
    pattern: 'ir',
    explanation: 'The "ir" team makes the /er/ sound',
    examples: ['bird', 'first', 'girl', 'shirt'],
  },
  'ur': {
    pattern: 'ur',
    explanation: 'The "ur" team makes the /er/ sound',
    examples: ['burn', 'turn', 'hurt', 'purple'],
  },
  'or': {
    pattern: 'or',
    explanation: 'The "or" team makes the /or/ sound',
    examples: ['for', 'fork', 'storm', 'corn'],
  },
};

// Find phonics patterns in a word
export function findPhonicsPatterns(word: string): PhonicsRule[] {
  const patterns: PhonicsRule[] = [];
  const lowerWord = word.toLowerCase();

  // Check for silent e
  if (lowerWord.endsWith('e') && lowerWord.length > 2) {
    const vowelBeforeE = lowerWord[lowerWord.length - 2];
    if (!'aeiou'.includes(vowelBeforeE)) {
      patterns.push(phonicsRules['silent_e']);
    }
  }

  // Check for other patterns
  Object.entries(phonicsRules).forEach(([key, rule]) => {
    if (key === 'silent_e') return; // Already checked
    if (lowerWord.includes(rule.pattern)) {
      patterns.push(rule);
    }
  });

  return patterns;
}

// Get phonics hint based on misspelling
export function getPhonicsHint(correctWord: string, userInput: string): string | null {
  const correct = correctWord.toLowerCase();
  const input = userInput.toLowerCase();

  // If completely correct
  if (correct === input) return null;

  // Find differences
  const patterns = findPhonicsPatterns(correct);
  
  if (patterns.length === 0) {
    return "Try sounding out each letter carefully.";
  }

  // Check if the error involves a phonics pattern
  for (const pattern of patterns) {
    if (!input.includes(pattern.pattern)) {
      return `${pattern.explanation}. Examples: ${pattern.examples.slice(0, 2).join(', ')}`;
    }
  }

  // Check for common mistakes
  if (correct.includes('ei') && input.includes('ie')) {
    return '"I before E except after C" - but this word is an exception!';
  }
  
  if (correct.includes('ie') && input.includes('ei')) {
    return 'Remember: "I before E except after C"';
  }

  // Default hint based on first pattern
  return patterns[0].explanation;
}

// Analyze user's spelling attempt
export function analyzeSpellingAttempt(correctWord: string, userInput: string): {
  correct: boolean;
  errors: string[];
  hints: string[];
} {
  const correct = correctWord.toLowerCase();
  const input = userInput.toLowerCase();

  if (correct === input) {
    return { correct: true, errors: [], hints: [] };
  }

  const errors: string[] = [];
  const hints: string[] = [];

  // Character-by-character comparison
  const maxLen = Math.max(correct.length, input.length);
  for (let i = 0; i < maxLen; i++) {
    if (correct[i] !== input[i]) {
      if (i < correct.length && i < input.length) {
        errors.push(`Position ${i + 1}: expected "${correct[i]}", got "${input[i]}"`);
      } else if (i >= input.length) {
        errors.push(`Missing letter "${correct[i]}" at position ${i + 1}`);
      } else {
        errors.push(`Extra letter "${input[i]}" at position ${i + 1}`);
      }
    }
  }

  // Get phonics hint
  const phonicsHint = getPhonicsHint(correctWord, userInput);
  if (phonicsHint) {
    hints.push(phonicsHint);
  }

  // Add encouraging message
  if (errors.length <= 2) {
    hints.push("You're very close! Try again!");
  }

  return { correct: false, errors, hints };
}

// Get all phonics rules for a specific pattern type
export function getRulesByType(type: 'vowel_teams' | 'silent_letters' | 'digraphs' | 'r_controlled'): PhonicsRule[] {
  const typeMap = {
    vowel_teams: ['ai', 'ay', 'ea', 'ee', 'oa', 'ow', 'oi', 'oy', 'ou'],
    silent_letters: ['silent_e', 'kn', 'wr', 'mb', 'gh'],
    digraphs: ['ch', 'sh', 'th', 'ph'],
    r_controlled: ['ar', 'er', 'ir', 'ur', 'or'],
  };

  return typeMap[type].map(key => phonicsRules[key]).filter(Boolean);
}
