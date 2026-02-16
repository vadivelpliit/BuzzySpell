import React, { useState, useEffect } from 'react';
import { MasteredWord, userApi } from '../../services/api';
import { useUser } from '../../contexts/UserContext';
import speechService from '../../utils/speechService';

export default function GoldenHive() {
  const { currentUser } = useUser();
  const [words, setWords] = useState<MasteredWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<MasteredWord | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | 'expert' | 'master'>('all');

  useEffect(() => {
    if (currentUser) {
      loadWords();
    }
  }, [currentUser]);

  const loadWords = async () => {
    if (!currentUser) return;
    
    try {
      const data = await userApi.getGoldenHive(currentUser.id);
      setWords(data);
    } catch (error) {
      console.error('Error loading golden hive:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = async (word: MasteredWord) => {
    setSelectedWord(word);
    try {
      await speechService.speak(word.word);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const getWordBadge = (word: MasteredWord) => {
    if (word.times_spelled_correctly >= 5 && word.used_in_dictation) {
      return { emoji: '👑', label: 'Master', color: 'from-yellow-400 to-yellow-600' };
    } else if (word.times_spelled_correctly >= 3) {
      return { emoji: '⭐', label: 'Expert', color: 'from-blue-400 to-blue-600' };
    } else {
      return { emoji: '🌟', label: 'Learning', color: 'from-green-400 to-green-600' };
    }
  };

  const filteredWords = words.filter(word => {
    if (filterLevel === 'all') return true;
    const badge = getWordBadge(word);
    if (filterLevel === 'expert') return badge.label === 'Expert';
    if (filterLevel === 'master') return badge.label === 'Master';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐝</div>
          <p className="text-2xl">Loading your golden hive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-bee-orange">
            🏆 The Golden Hive 🏆
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            Your Collection of Mastered Words
          </p>
          <p className="text-xl text-gray-600">
            {words.length} words collected
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              filterLevel === 'all' 
                ? 'bg-bee-yellow text-gray-900 scale-110' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => setFilterLevel('expert')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              filterLevel === 'expert' 
                ? 'bg-blue-500 text-white scale-110' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⭐ Expert
          </button>
          <button
            onClick={() => setFilterLevel('master')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              filterLevel === 'master' 
                ? 'bg-yellow-500 text-white scale-110' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👑 Master
          </button>
        </div>

        {/* Words grid */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-4">🐝</p>
            <p className="text-xl text-gray-600">
              {filterLevel === 'all' 
                ? 'Start spelling to collect words in your golden hive!' 
                : `No ${filterLevel} words yet. Keep practicing!`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredWords.map((word) => {
              const badge = getWordBadge(word);
              return (
                <div
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  className="card cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-hive-light to-hive-medium"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-4xl mb-2">{badge.emoji}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {word.word}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold`}>
                      {badge.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      ✓ {word.times_spelled_correctly}x
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected word detail */}
        {selectedWord && (
          <div className="card bg-gradient-to-br from-bee-yellow to-bee-gold p-8">
            <button
              onClick={() => setSelectedWord(null)}
              className="float-right text-2xl"
            >
              ✕
            </button>
            <h2 className="text-4xl font-bold mb-4 text-center">
              {selectedWord.word}
            </h2>
            <div className="space-y-3 text-lg">
              <p><strong>📖 Definition:</strong> {selectedWord.definition}</p>
              <p><strong>🌍 Origin:</strong> {selectedWord.origin}</p>
              <p><strong>🔤 Phonics:</strong> {selectedWord.phonics_pattern}</p>
              <p><strong>✓ Times Spelled Correctly:</strong> {selectedWord.times_spelled_correctly}</p>
              <p><strong>📝 Used in Dictation:</strong> {selectedWord.used_in_dictation ? 'Yes' : 'Not yet'}</p>
              <p className="text-sm text-gray-700">
                <strong>Last Reviewed:</strong> {new Date(selectedWord.last_reviewed).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Achievement summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center bg-gradient-to-br from-green-100 to-green-200">
            <p className="text-4xl mb-2">🌟</p>
            <p className="text-2xl font-bold">
              {words.filter(w => getWordBadge(w).label === 'Learning').length}
            </p>
            <p className="text-lg text-gray-700">Learning</p>
          </div>
          <div className="card text-center bg-gradient-to-br from-blue-100 to-blue-200">
            <p className="text-4xl mb-2">⭐</p>
            <p className="text-2xl font-bold">
              {words.filter(w => getWordBadge(w).label === 'Expert').length}
            </p>
            <p className="text-lg text-gray-700">Expert</p>
          </div>
          <div className="card text-center bg-gradient-to-br from-yellow-100 to-yellow-200">
            <p className="text-4xl mb-2">👑</p>
            <p className="text-2xl font-bold">
              {words.filter(w => getWordBadge(w).label === 'Master').length}
            </p>
            <p className="text-lg text-gray-700">Master</p>
          </div>
        </div>
      </div>
    </div>
  );
}
