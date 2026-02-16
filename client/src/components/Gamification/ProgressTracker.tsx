import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

interface DailyStreak {
  streak_date: string;
  minutes_practiced: number;
  activities_completed: number;
}

export default function ProgressTracker() {
  const { currentUser } = useUser();
  const [streaks, setStreaks] = useState<DailyStreak[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    }
  }, [currentUser]);

  const loadProgress = async () => {
    if (!currentUser) return;

    try {
      const progress = await userApi.getProgress(currentUser.id);
      setCurrentStreak(progress.currentStreak);
      // Note: Would need to add streak details endpoint
      setLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      setLoading(false);
    }
  };

  const getMilestoneMessage = () => {
    if (currentStreak >= 30) return { emoji: '🏆', message: 'Master Learner!' };
    if (currentStreak >= 14) return { emoji: '🔥', message: 'On Fire!' };
    if (currentStreak >= 7) return { emoji: '⭐', message: 'Great Job!' };
    if (currentStreak >= 3) return { emoji: '🌟', message: 'Keep Going!' };
    return { emoji: '💪', message: 'Start Your Streak!' };
  };

  const milestone = getMilestoneMessage();

  // Generate calendar for last 30 days
  const generateCalendar = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const isDatePracticed = (date: Date) => {
    // In real app, check against streaks data
    // For now, mark dates within current streak
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < currentStreak;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-2xl">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-bee-orange">
            📊 Your Progress
          </h1>
        </div>

        {/* Current Streak */}
        <div className="card mb-8 bg-gradient-to-br from-bee-yellow to-bee-gold text-center">
          <p className="text-6xl mb-4">{milestone.emoji}</p>
          <h2 className="text-5xl font-bold mb-2 text-gray-900">
            {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
          </h2>
          <p className="text-2xl text-gray-800 mb-4">Current Streak</p>
          <p className="text-xl text-gray-700">{milestone.message}</p>
        </div>

        {/* Milestone badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`card text-center ${currentStreak >= 3 ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gray-100 opacity-50'}`}>
            <p className="text-4xl mb-2">🌟</p>
            <p className="text-lg font-bold">3 Days</p>
            <p className="text-sm text-gray-600">Getting Started</p>
          </div>
          <div className={`card text-center ${currentStreak >= 7 ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gray-100 opacity-50'}`}>
            <p className="text-4xl mb-2">⭐</p>
            <p className="text-lg font-bold">7 Days</p>
            <p className="text-sm text-gray-600">One Week</p>
          </div>
          <div className={`card text-center ${currentStreak >= 14 ? 'bg-gradient-to-br from-orange-100 to-orange-200' : 'bg-gray-100 opacity-50'}`}>
            <p className="text-4xl mb-2">🔥</p>
            <p className="text-lg font-bold">14 Days</p>
            <p className="text-sm text-gray-600">On Fire</p>
          </div>
          <div className={`card text-center ${currentStreak >= 30 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gray-100 opacity-50'}`}>
            <p className="text-4xl mb-2">🏆</p>
            <p className="text-lg font-bold">30 Days</p>
            <p className="text-sm text-gray-600">Champion</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-4 text-center">Last 30 Days</h3>
          <div className="grid grid-cols-10 gap-2">
            {generateCalendar().map((date, idx) => {
              const practiced = isDatePracticed(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    practiced 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  } ${
                    isToday ? 'ring-4 ring-bee-yellow' : ''
                  }`}
                  title={date.toLocaleDateString()}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Practiced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Missed</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 card bg-blue-50">
          <h3 className="text-xl font-bold mb-3 text-blue-800">💡 Streak Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Practice at least 15 minutes daily to maintain your streak</li>
            <li>✓ Complete spelling or reading activities to count</li>
            <li>✓ Try to practice at the same time each day to build a habit</li>
            <li>✓ Longer streaks unlock special bee accessories and rewards!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
