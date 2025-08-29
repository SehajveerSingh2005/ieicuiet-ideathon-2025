"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebaseFirestore } from './FirebaseFirestoreContext';

interface LeaderboardVisibilityContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => Promise<void>;
}

const LeaderboardVisibilityContext = createContext<LeaderboardVisibilityContextType | undefined>(undefined);

export const LeaderboardVisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisibleState] = useState<boolean>(true);
  const { getLeaderboardVisibility, setLeaderboardVisibility } = useFirebaseFirestore();

 // Load leaderboard visibility from Firebase on mount
  useEffect(() => {
    const loadVisibility = async () => {
      try {
        const visibility = await getLeaderboardVisibility();
        setIsVisibleState(visibility);
      } catch (error) {
        console.error('Error loading leaderboard visibility:', error);
        // Fallback to default visible
        setIsVisibleState(true);
      }
    };
    
    loadVisibility();
  }, [getLeaderboardVisibility]);

  const setIsVisible = async (visible: boolean) => {
    try {
      await setLeaderboardVisibility(visible);
      setIsVisibleState(visible);
    } catch (error) {
      console.error('Error setting leaderboard visibility:', error);
    }
  };

  return (
    <LeaderboardVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </LeaderboardVisibilityContext.Provider>
  );
};

export const useLeaderboardVisibility = () => {
  const context = useContext(LeaderboardVisibilityContext);
  if (context === undefined) {
    throw new Error('useLeaderboardVisibility must be used within a LeaderboardVisibilityProvider');
  }
  return context;
};