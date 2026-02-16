import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../services/api';
import speechService from '../../utils/speechService';

interface GatewayTestProps {
  words: SpellingWord[];
  onComplete: (passed: boolean, score: number, attempts: any[]) => void;
  level: number;
}

export default function GatewayTest({ words, onComplete, level }: GatewayTestProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);

  const currentWord = words[currentWordIndex];
  const PASSING_SCORE = 0.8; // 80% to pass

  useEffect(() => {
    if (currentWord) {
      handleSpeak();
    }
  }, [currentWordIndex]);

  const handleSpeak = async () => {
    try {
      await speechService.speak(currentWord.word);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const correct = userInput.toLowerCase() === currentWord.word.toLowerCase();
    const newAttempt = {
      word: currentWord.word,
      user_input: userInput,
      correct,
      definition: currentWord.definition,
      origin: currentWord.origin,
      phonics_pattern: currentWord.phonics_pattern,
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);
    setUserInput('');
    setShowDefinition(false);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Test complete
      const score = newAttempts.filter(a => a.correct).length;
      const passed = score / words.length >= PASSING_SCORE;
      setShowResult(true);
      setTimeout(() => {
        onComplete(passed, score, newAttempts);
      }, 3000);
    }
  };

  const score = attempts.filter(a => a.correct).length;
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  if (showResult) {
    const passed = score / words.length >= PASSING_SCORE;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className={`card max-w-2xl w-full text-center ${
          passed ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gradient-to-br from-orange-100 to-orange-200'
        }`}>
          <h1 className="text-5xl font-bold mb-6">
            {passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
          </h1>
          
          <div className="text-3xl mb-8">
            <p className="mb-2">Your Score:</p>
            <p className="text-6xl font-bold text-bee-orange">
              {score} / {words.length}
            </p>
            <p className="text-2xl mt-2 text-gray-600">
              ({Math.round((score / words.length) * 100)}%)
            </p>
          </div>

          {passed ? (
            <div className="space-y-4">
              <p className="text-2xl">
                Amazing work! You've unlocked Level {level + 1}! 🚀
              </p>
              <p className="text-xl text-gray-600">
                Keep up the great spelling!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl">
                You need {Math.ceil(words.length * PASSING_SCORE)} correct to pass.
              </p>
              <p className="text-xl text-gray-600">
                Review the words and try again. You can do it!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-bee-orange mb-4">
          🏆 Gateway Test - Level {level}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Hard Mode: Audio Only (Click for hints)
        </p>
        <p className="text-2xl font-bold">
          Word {currentWordIndex + 1} of {words.length}
        </p>
        <div className="w-64 h-4 bg-gray-300 rounded-full mt-2 mx-auto overflow-hidden">
          <div 
            className="h-full bg-bee-yellow transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xl mt-2 text-green-600 font-bold">
          Current Score: {score} / {currentWordIndex + attempts.length}
        </p>
      </div>

      {/* Test card */}
      <div className="card max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSpeak}
            className="btn-primary text-2xl"
          >
            🔊 Hear the word
          </button>
        </div>

        {/* Optional hints */}
        <div className="mb-6 text-center space-y-3">
          <button
            onClick={() => setShowDefinition(!showDefinition)}
            className="text-blue-600 underline text-xl hover:text-blue-800"
          >
            {showDefinition ? 'Hide' : 'Show'} Hints
          </button>
          
          {showDefinition && (
            <div className="p-4 bg-blue-50 rounded-lg text-left space-y-2">
              <p className="text-lg"><strong>📖 Definition:</strong> {currentWord.definition}</p>
              <p className="text-lg"><strong>🌍 Origin:</strong> {currentWord.origin}</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the word here..."
            className="input-field text-center"
            autoFocus
          />

          <div className="flex justify-center">
            <button type="submit" className="btn-primary text-xl">
              Submit Answer
            </button>
          </div>
        </form>

        {/* Previous attempts preview */}
        {attempts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300">
            <h3 className="text-lg font-bold mb-2">Previous Words:</h3>
            <div className="flex flex-wrap gap-2">
              {attempts.map((attempt, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm ${
                    attempt.correct 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {attempt.correct ? '✓' : '✗'} {attempt.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
