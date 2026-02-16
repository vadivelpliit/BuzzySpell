import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Avatar, userApi } from '../services/api';

interface UserContextType {
  currentUser: User | null;
  avatar: Avatar | null;
  setCurrentUser: (user: User | null) => void;
  refreshAvatar: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadAvatar(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const loadAvatar = async (userId: number) => {
    try {
      const avatarData = await userApi.getAvatar(userId);
      setAvatar(avatarData);
    } catch (error) {
      console.error('Error loading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAvatar = async () => {
    if (currentUser) {
      await loadAvatar(currentUser.id);
    }
  };

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      loadAvatar(user.id);
    } else {
      localStorage.removeItem('currentUser');
      setAvatar(null);
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      avatar, 
      setCurrentUser: handleSetCurrentUser, 
      refreshAvatar,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
