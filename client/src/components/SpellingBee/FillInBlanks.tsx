import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../services/api';
import speechService from '../../utils/speechService';
import { analyzeSpellingAttempt } from '../../utils/phonicsRules';

type Difficulty = 'easy' | 'medium' | 'hard';

interface FillInBlanksProps {
  word: SpellingWord;
  difficulty: Difficulty;
  onComplete: (correct: boolean, attempt: string, phonicsHint?: string) => void;
  currentIndex: number;
  totalWords: number;
}

export default function FillInBlanks({ 
  word, 
  difficulty, 
  onComplete, 
  currentIndex, 
  totalWords 
}: FillInBlanksProps) {
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; hints: string[] } | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);

  useEffect(() => {
    // Auto-play audio on mount
    handleSpeak();
  }, [word]);

  const handleSpeak = async () => {
    try {
      await speechService.speak(word.word);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const getHintDisplay = (): string => {
    const wordLower = word.word.toLowerCase();
    
    if (difficulty === 'easy') {
      // Show 50% of letters
      return wordLower
        .split('')
        .map((char, idx) => (idx % 2 === 0 ? char : '_'))
        .join(' ');
    } else if (difficulty === 'medium') {
      // Show first letter only
      return wordLower[0] + ' ' + '_ '.repeat(wordLower.length - 1);
    } else {
      // Hard mode - no visual hints
      return '_ '.repeat(wordLower.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const analysis = analyzeSpellingAttempt(word.word, userInput);
    setFeedback(analysis);

    if (analysis.correct) {
      setTimeout(() => {
        onComplete(true, userInput);
      }, 1500);
    }
  };

  const handleSkip = () => {
    onComplete(false, userInput, 'Skipped');
  };

  const handleTryAgain = () => {
    setUserInput('');
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Progress */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold text-bee-orange">
          Word {currentIndex + 1} of {totalWords}
        </p>
        <div className="w-64 h-4 bg-gray-300 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-bee-yellow transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
          />
        </div>
      </div>

      <div className="card max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-bee-orange">
          Spell the Word!
        </h2>

        {/* Audio button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSpeak}
            className="btn-primary text-2xl"
          >
            🔊 Hear the word
          </button>
        </div>

        {/* Hint display */}
        {showHint && difficulty !== 'hard' && (
          <div className="text-center mb-6">
            <p className="text-4xl font-mono tracking-wider text-gray-600">
              {getHintDisplay()}
            </p>
          </div>
        )}

        {/* Definition (for hard mode) */}
        {difficulty === 'hard' && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowDefinition(!showDefinition)}
              className="text-blue-600 underline text-xl"
            >
              {showDefinition ? 'Hide' : 'Show'} Definition
            </button>
            {showDefinition && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-xl"><strong>Definition:</strong> {word.definition}</p>
                <p className="text-lg mt-2"><strong>Origin:</strong> {word.origin}</p>
              </div>
            )}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the word here..."
              className="input-field text-center"
              autoFocus
              disabled={feedback?.correct}
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg ${
              feedback.correct 
                ? 'bg-green-100 border-4 border-green-500' 
                : 'bg-orange-100 border-4 border-orange-400'
            }`}>
              {feedback.correct ? (
                <div className="text-center">
                  <p className="text-3xl mb-2">🎉 Excellent!</p>
                  <p className="text-2xl font-bold text-green-700">
                    "{word.word}" is correct!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-orange-700 mb-2">
                    Not quite! Let's try again 💪
                  </p>
                  {feedback.hints.map((hint, idx) => (
                    <p key={idx} className="text-xl text-gray-700 mb-2">
                      💡 {hint}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {!feedback?.correct && (
              <>
                {!showHint && difficulty !== 'hard' && (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="btn-secondary"
                  >
                    Show Hint
                  </button>
                )}
                
                {!feedback ? (
                  <button type="submit" className="btn-primary">
                    Check Spelling
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 bg-gray-400 text-white rounded-full hover:bg-gray-500"
                >
                  Skip Word
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
