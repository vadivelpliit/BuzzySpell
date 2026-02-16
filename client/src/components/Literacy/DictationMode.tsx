import React, { useState } from 'react';
import speechService from '../../utils/speechService';

const dictationSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "I love to read books every day.",
  "My friend and I went to the park yesterday.",
  "The sun shines brightly in the sky.",
  "She likes to play with her toys.",
  "We went swimming at the beach.",
  "The cat sleeps on the soft pillow.",
  "He rides his bike to school.",
  "They are learning new words today.",
  "The flowers bloom in the spring.",
];

interface DictationError {
  position: number;
  expected: string;
  actual: string;
  type: 'spelling' | 'punctuation' | 'capitalization' | 'spacing';
}

export default function DictationMode() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showSentence, setShowSentence] = useState(false);
  const [errors, setErrors] = useState<DictationError[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentSentence = dictationSentences[currentSentenceIndex];

  const handlePlaySentence = async () => {
    try {
      await speechService.speak(currentSentence, { rate: 0.8 });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const analyzeInput = (): DictationError[] => {
    const foundErrors: DictationError[] = [];
    const expected = currentSentence;
    const actual = userInput;

    // Check capitalization of first letter
    if (expected[0] !== actual[0]) {
      foundErrors.push({
        position: 0,
        expected: expected[0],
        actual: actual[0] || '',
        type: 'capitalization',
      });
    }

    // Check ending punctuation
    const expectedEnd = expected[expected.length - 1];
    const actualEnd = actual[actual.length - 1];
    if (expectedEnd !== actualEnd) {
      foundErrors.push({
        position: expected.length - 1,
        expected: expectedEnd,
        actual: actualEnd || '',
        type: 'punctuation',
      });
    }

    // Word-by-word comparison
    const expectedWords = expected.toLowerCase().replace(/[.,!?]/g, '').split(' ');
    const actualWords = actual.toLowerCase().replace(/[.,!?]/g, '').split(' ');

    expectedWords.forEach((expectedWord, idx) => {
      const actualWord = actualWords[idx] || '';
      if (expectedWord !== actualWord) {
        foundErrors.push({
          position: idx,
          expected: expectedWord,
          actual: actualWord,
          type: 'spelling',
        });
      }
    });

    // Check for extra or missing words
    if (actualWords.length !== expectedWords.length) {
      foundErrors.push({
        position: -1,
        expected: `${expectedWords.length} words`,
        actual: `${actualWords.length} words`,
        type: 'spacing',
      });
    }

    return foundErrors;
  };

  const handleCheck = () => {
    const foundErrors = analyzeInput();
    setErrors(foundErrors);
    setShowFeedback(true);

    if (foundErrors.length === 0) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentSentenceIndex < dictationSentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setUserInput('');
      setShowSentence(false);
      setErrors([]);
      setShowFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setUserInput('');
    setErrors([]);
    setShowFeedback(false);
  };

  const getErrorMessage = (error: DictationError): string => {
    switch (error.type) {
      case 'capitalization':
        return `Start the sentence with a capital letter: "${error.expected}"`;
      case 'punctuation':
        return `End with correct punctuation: "${error.expected}"`;
      case 'spelling':
        return `"${error.actual}" should be "${error.expected}"`;
      case 'spacing':
        return `Check your word count: ${error.actual} instead of ${error.expected}`;
      default:
        return 'Check this part carefully';
    }
  };

  const highlightErrors = () => {
    if (!showFeedback || errors.length === 0) return userInput;

    const expectedWords = currentSentence.toLowerCase().replace(/[.,!?]/g, '').split(' ');
    const actualWords = userInput.toLowerCase().replace(/[.,!?]/g, '').split(' ');

    return actualWords.map((word, idx) => {
      const hasError = errors.some(e => e.position === idx && e.type === 'spelling');
      return (
        <span key={idx} className={hasError ? 'bg-red-200 px-1 rounded' : ''}>
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bee-orange mb-4">
            ✍️ Dictation Practice
          </h1>
          <p className="text-xl text-gray-700">
            Listen carefully and type what you hear
          </p>
          <div className="mt-4">
            <p className="text-2xl font-bold">
              Sentence {currentSentenceIndex + 1} of {dictationSentences.length}
            </p>
            <p className="text-lg text-green-600 font-bold mt-2">
              Perfect Sentences: {score}
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="card">
          {/* Audio button */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handlePlaySentence}
              className="btn-primary text-xl"
            >
              🔊 Play Sentence
            </button>
            <button
              onClick={() => setShowSentence(!showSentence)}
              className="btn-secondary text-xl"
            >
              {showSentence ? '👁️ Hide' : '👁️ Show'} Sentence
            </button>
          </div>

          {/* Show sentence (for practice) */}
          {showSentence && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg text-center">
              <p className="text-2xl font-mono">{currentSentence}</p>
            </div>
          )}

          {/* Input area */}
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2 text-gray-700">
              Type the sentence:
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type what you hear..."
              className="input-field min-h-[100px] resize-none"
              disabled={showFeedback && errors.length === 0}
            />
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mb-6 p-4 rounded-lg ${
              errors.length === 0 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-orange-100 border-2 border-orange-400'
            }`}>
              {errors.length === 0 ? (
                <div className="text-center">
                  <p className="text-3xl mb-2">🎉 Perfect!</p>
                  <p className="text-xl text-green-700">
                    Your dictation is exactly right!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-orange-700 mb-3">
                    Let's fix a few things:
                  </p>
                  <div className="space-y-2">
                    {errors.map((error, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <p className="text-lg">{getErrorMessage(error)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-white rounded">
                    <p className="font-bold mb-1">Correct sentence:</p>
                    <p className="text-lg font-mono">{currentSentence}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            {!showFeedback ? (
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className={`btn-primary ${!userInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Check My Work
              </button>
            ) : (
              <>
                {errors.length > 0 && (
                  <button
                    onClick={handleTryAgain}
                    className="btn-secondary"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={currentSentenceIndex >= dictationSentences.length - 1}
                >
                  Next Sentence →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 card bg-blue-50">
          <h3 className="text-lg font-bold mb-2 text-blue-800">💡 Dictation Tips</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>✓ Start sentences with a capital letter</li>
            <li>✓ End sentences with proper punctuation (. ! ?)</li>
            <li>✓ Put spaces between words</li>
            <li>✓ Check your spelling carefully</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
