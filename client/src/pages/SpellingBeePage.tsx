import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentApi, userApi, SpellingWord } from '../services/api';
import { useUser } from '../contexts/UserContext';
import Flashcard from '../components/SpellingBee/Flashcard';
import FillInBlanks from '../components/SpellingBee/FillInBlanks';
import GatewayTest from '../components/SpellingBee/GatewayTest';

type Mode = 'select' | 'flashcards' | 'practice' | 'gateway';
type Difficulty = 'easy' | 'medium' | 'hard';

export default function SpellingBeePage() {
  const navigate = useNavigate();
  const { currentUser, refreshAvatar } = useUser();
  const [mode, setMode] = useState<Mode>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'select' && words.length === 0) {
      loadWords();
    }
  }, [mode, level]);

  const loadWords = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await contentApi.getSpellingWords(currentUser.grade, level);
      setWords(data);
    } catch (error) {
      console.error('Error loading words:', error);
      alert('Failed to load words. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Flashcards complete
      alert('Great job studying all the words!');
      handleBackToMenu();
    }
  };

  const handlePracticeComplete = (correct: boolean, attempt: string, phonicsHint?: string) => {
    const newAttempt = {
      word: words[currentWordIndex].word,
      user_input: attempt,
      correct,
      phonics_hint: phonicsHint,
      definition: words[currentWordIndex].definition,
      origin: words[currentWordIndex].origin,
      phonics_pattern: words[currentWordIndex].phonics_pattern,
    };
    
    setAttempts([...attempts, newAttempt]);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Practice complete - save results
      saveResults(attempts.concat([newAttempt]));
    }
  };

  const handleGatewayComplete = async (passed: boolean, score: number, gatewayAttempts: any[]) => {
    if (!currentUser) return;

    try {
      await userApi.saveSpellingResult(currentUser.id, {
        grade: currentUser.grade,
        level,
        difficulty: 'hard',
        score,
        total_words: words.length,
        passed,
        words_attempted: gatewayAttempts,
      });

      await refreshAvatar();

      if (passed) {
        alert(`Congratulations! You passed Level ${level}!\nYou can now access Level ${level + 1}!`);
      } else {
        alert('Keep practicing! Try the study and practice modes again.');
      }
      
      handleBackToMenu();
    } catch (error) {
      console.error('Error saving gateway result:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  const saveResults = async (allAttempts: any[]) => {
    if (!currentUser) return;

    const score = allAttempts.filter(a => a.correct).length;
    const passed = score / allAttempts.length >= 0.7;

    try {
      await userApi.saveSpellingResult(currentUser.id, {
        grade: currentUser.grade,
        level,
        difficulty,
        score,
        total_words: allAttempts.length,
        passed,
        words_attempted: allAttempts,
      });

      await refreshAvatar();

      alert(`Practice complete! Score: ${score}/${allAttempts.length}`);
      handleBackToMenu();
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  const handleBackToMenu = () => {
    setMode('select');
    setCurrentWordIndex(0);
    setAttempts([]);
    setWords([]);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl mb-4">Please select a user first</p>
          <button onClick={() => navigate('/users')} className="btn-primary">
            Select User
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📝</div>
          <p className="text-2xl">Loading words...</p>
        </div>
      </div>
    );
  }

  // Mode selection screen
  if (mode === 'select') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-bee-orange mb-4">📝 Spelling Bee</h1>
            <p className="text-2xl text-gray-700">Choose your level and activity</p>
          </div>

          {/* Level selection */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Level</h2>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-4 rounded-xl font-bold text-xl transition-all ${
                    level === l
                      ? 'bg-bee-yellow text-gray-900 scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Activity selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <button
              onClick={() => setMode('flashcards')}
              className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 transition-transform p-8"
            >
              <p className="text-5xl mb-3">📇</p>
              <h3 className="text-2xl font-bold mb-2">Study Phase</h3>
              <p className="text-lg">Learn words with flashcards</p>
            </button>

            <button
              onClick={() => {
                setMode('practice');
              }}
              className="card bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 transition-transform p-8"
            >
              <p className="text-5xl mb-3">✏️</p>
              <h3 className="text-2xl font-bold mb-2">Practice Phase</h3>
              <p className="text-lg">Fill in the blanks</p>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                onClick={(e) => e.stopPropagation()}
                className="mt-3 px-3 py-2 rounded-lg bg-white text-gray-900 font-bold"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </button>

            <button
              onClick={() => setMode('gateway')}
              className="card bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:scale-105 transition-transform p-8"
            >
              <p className="text-5xl mb-3">🏆</p>
              <h3 className="text-2xl font-bold mb-2">Gateway Test</h3>
              <p className="text-lg">Pass to unlock next level</p>
            </button>
          </div>

          <button onClick={() => navigate('/')} className="btn-secondary w-full">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate component based on mode
  if (mode === 'flashcards' && words.length > 0) {
    return (
      <div>
        <Flashcard
          word={words[currentWordIndex]}
          onNext={handleFlashcardNext}
          currentIndex={currentWordIndex}
          totalWords={words.length}
        />
        <div className="fixed bottom-4 left-4">
          <button onClick={handleBackToMenu} className="btn-secondary">
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'practice' && words.length > 0) {
    return (
      <div>
        <FillInBlanks
          word={words[currentWordIndex]}
          difficulty={difficulty}
          onComplete={handlePracticeComplete}
          currentIndex={currentWordIndex}
          totalWords={words.length}
        />
        <div className="fixed bottom-4 left-4">
          <button onClick={handleBackToMenu} className="btn-secondary">
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'gateway' && words.length > 0) {
    const testWords = words.slice(0, 10); // Use 10 words for gateway test
    return (
      <div>
        <GatewayTest
          words={testWords}
          onComplete={handleGatewayComplete}
          level={level}
        />
      </div>
    );
  }

  return null;
}
