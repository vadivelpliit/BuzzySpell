import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentApi, userApi, Story } from '../services/api';
import { useUser } from '../contexts/UserContext';
import StoryReader from '../components/Reading/StoryReader';
import ComprehensionQuiz from '../components/Reading/ComprehensionQuiz';

type Mode = 'select' | 'reading' | 'quiz';

export default function ReadingPage() {
  const navigate = useNavigate();
  const { currentUser, refreshAvatar } = useUser();
  const [mode, setMode] = useState<Mode>('select');
  const [level, setLevel] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'select' && stories.length === 0 && level) {
      loadStories();
    }
  }, [level]);

  const loadStories = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await contentApi.getStoryPack(currentUser.grade, level);
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
      alert('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryComplete = () => {
    setMode('quiz');
  };

  const handleQuizComplete = async (passed: boolean, score: number) => {
    if (!currentUser || stories.length === 0) return;

    const currentStory = stories[currentStoryIndex];

    try {
      await userApi.saveReadingResult(currentUser.id, {
        grade: currentUser.grade,
        level,
        story_id: currentStory.id,
        story_number: currentStoryIndex + 1,
        score,
        total_questions: currentStory.questions.length,
        passed,
      });

      await refreshAvatar();

      if (passed) {
        if (currentStoryIndex < stories.length - 1) {
          // Move to next story
          setCurrentStoryIndex(currentStoryIndex + 1);
          setMode('select');
        } else {
          // All stories in this level complete
          alert(`Congratulations! You completed all stories in Level ${level}!`);
          handleBackToMenu();
        }
      } else {
        alert('Read the story again and try the quiz once more!');
        setMode('select');
      }
    } catch (error) {
      console.error('Error saving reading result:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  const handleBackToMenu = () => {
    setMode('select');
    setCurrentStoryIndex(0);
    setStories([]);
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
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-2xl">Loading stories...</p>
        </div>
      </div>
    );
  }

  // Story/level selection
  if (mode === 'select') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">📚 Reading & Stories</h1>
            <p className="text-2xl text-gray-700">Choose your level and story</p>
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
                      ? 'bg-blue-500 text-white scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Story selection */}
          {stories.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-2xl font-bold text-center">Select a Story</h2>
              {stories.map((story, idx) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setCurrentStoryIndex(idx);
                    setMode('reading');
                  }}
                  className={`card w-full hover:scale-105 transition-transform text-left ${
                    idx === currentStoryIndex
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Story {idx + 1}: {story.title}
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span>📊 {story.difficulty_level}</span>
                        <span>📝 {story.word_count} words</span>
                        <span>❓ {story.questions.length} questions</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm">🏷️ {story.themes.join(', ')}</span>
                      </div>
                    </div>
                    <span className="text-4xl">📖</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => navigate('/')} className="btn-secondary w-full">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Reading mode
  if (mode === 'reading' && stories.length > 0) {
    return (
      <div>
        <StoryReader
          story={stories[currentStoryIndex]}
          onComplete={handleStoryComplete}
        />
        <div className="fixed bottom-4 left-4">
          <button onClick={() => setMode('select')} className="btn-secondary">
            ← Back to Stories
          </button>
        </div>
      </div>
    );
  }

  // Quiz mode
  if (mode === 'quiz' && stories.length > 0) {
    const currentStory = stories[currentStoryIndex];
    return (
      <div>
        <ComprehensionQuiz
          questions={currentStory.questions}
          storyTitle={currentStory.title}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return null;
}
