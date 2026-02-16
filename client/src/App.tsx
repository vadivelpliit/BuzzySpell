import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Home from './pages/Home';
import UserSelect from './pages/UserSelect';
import SpellingBeePage from './pages/SpellingBeePage';
import ReadingPage from './pages/ReadingPage';
import GoldenHive from './components/Gamification/GoldenHive';
import ProgressTracker from './components/Gamification/ProgressTracker';
import DictationMode from './components/Literacy/DictationMode';
import RootWordAnalyzer from './components/Literacy/RootWordAnalyzer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐝</div>
          <p className="text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/users" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/users" element={<UserSelect />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spelling"
        element={
          <ProtectedRoute>
            <SpellingBeePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reading"
        element={
          <ProtectedRoute>
            <ReadingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/golden-hive"
        element={
          <ProtectedRoute>
            <GoldenHive />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dictation"
        element={
          <ProtectedRoute>
            <DictationMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/root-words"
        element={
          <ProtectedRoute>
            <RootWordAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
