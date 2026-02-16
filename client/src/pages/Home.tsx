import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { userApi } from '../services/api';
import BeeAvatar from '../components/Avatar/BeeAvatar';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, avatar } = useUser();
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    }
  }, [currentUser]);

  const loadProgress = async () => {
    if (!currentUser) return;
    try {
      const data = await userApi.getProgress(currentUser.id);
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const menuItems = [
    {
      title: '📝 Spelling Bee',
      description: 'Practice spelling with flashcards & tests',
      route: '/spelling',
      color: 'from-bee-yellow to-bee-gold',
    },
    {
      title: '📚 Reading & Stories',
      description: 'Read stories and answer questions',
      route: '/reading',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: '✍️ Dictation Practice',
      description: 'Type sentences from audio',
      route: '/dictation',
      color: 'from-green-400 to-green-600',
    },
    {
      title: '🔍 Root Word Analyzer',
      description: 'Break words into parts',
      route: '/root-words',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: '🏆 Golden Hive',
      description: 'Your mastered words collection',
      route: '/golden-hive',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: '📊 Progress Tracker',
      description: 'View streaks and achievements',
      route: '/progress',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with avatar */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-bee-orange mb-4 animate-float">
            🐝 Spelling Bee & Reading Coach
          </h1>
          {currentUser && avatar && (
            <div className="flex flex-col items-center mb-6">
              <BeeAvatar avatar={avatar} size="large" showStats />
              <p className="text-3xl font-bold mt-4">Welcome back, {currentUser.name}!</p>
              {progress && (
                <div className="mt-4 flex gap-6 text-lg">
                  <span>🎯 Current Streak: <strong>{progress.currentStreak} days</strong></span>
                  <span>📈 Highest Level: <strong>{progress.highestLevel}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`card bg-gradient-to-br ${item.color} text-white hover:scale-105 transition-transform cursor-pointer p-8`}
            >
              <h2 className="text-3xl font-bold mb-3">{item.title}</h2>
              <p className="text-lg">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Quick tips */}
        <div className="card bg-gradient-to-br from-hive-light to-hive-medium">
          <h3 className="text-2xl font-bold mb-4 text-bee-orange text-center">
            💡 Daily Learning Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-4xl mb-2">🎯</p>
              <p className="font-bold">Practice Daily</p>
              <p className="text-sm text-gray-600">15 minutes keeps your streak alive!</p>
            </div>
            <div>
              <p className="text-4xl mb-2">📖</p>
              <p className="font-bold">Read Aloud</p>
              <p className="text-sm text-gray-600">Use the read-aloud feature to improve fluency</p>
            </div>
            <div>
              <p className="text-4xl mb-2">🏆</p>
              <p className="font-bold">Collect Words</p>
              <p className="text-sm text-gray-600">Build your golden hive of mastered words!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
