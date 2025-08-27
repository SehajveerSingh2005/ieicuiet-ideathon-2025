"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebaseFirestore } from './FirebaseFirestoreContext';

interface VotingControlContextType {
  currentVotingTeam: { id: string; name: string } | null;
  isVotingActive: boolean;
  votingEndTime: Date | null;
  isLoading: boolean;
  setCurrentVotingTeam: (team: { id: string; name: string } | null) => Promise<void>;
  setIsVotingActive: (active: boolean) => Promise<void>;
  setVotingEndTime: (time: Date | null) => Promise<void>;
  endVoting: () => Promise<void>;
  refreshVotingState: () => Promise<void>;
}

const VotingControlContext = createContext<VotingControlContextType | undefined>(undefined);

export const VotingControlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { getVotingState, setVotingState } = useFirebaseFirestore();
  const [currentVotingTeam, setCurrentVotingTeamState] = useState<{ id: string; name: string } | null>(null);
  const [isVotingActive, setIsVotingActiveState] = useState<boolean>(false);
  const [votingEndTime, setVotingEndTimeState] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load voting state from Firebase on mount
  useEffect(() => {
    console.log('🔄 VotingControlContext: Loading voting state from Firebase...');
    
    // Add a small delay to ensure Firebase context is ready
    const timer = setTimeout(() => {
      refreshVotingState();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const refreshVotingState = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 VotingControlContext: Calling getVotingState...');
      const state = await getVotingState();
      console.log('✅ VotingControlContext: Got state from Firebase:', state);
      setCurrentVotingTeamState(state.currentVotingTeam);
      setIsVotingActiveState(state.isVotingActive);
      setVotingEndTimeState(state.votingEndTime);
    } catch (error) {
      console.error('❌ VotingControlContext: Error loading voting state from Firebase:', error);
      // Fallback to local state - keep current values
      console.log('⚠️ VotingControlContext: Using local voting state as fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentVotingTeam = async (team: { id: string; name: string } | null) => {
    setCurrentVotingTeamState(team);
    try {
      await setVotingState({ currentVotingTeam: team, isVotingActive, votingEndTime });
    } catch (error) {
      console.error('Error saving voting state to Firebase:', error);
      // Continue with local state even if Firebase fails
    }
  };

  const setIsVotingActive = async (active: boolean) => {
    setIsVotingActiveState(active);
    try {
      await setVotingState({ currentVotingTeam, isVotingActive: active, votingEndTime });
    } catch (error) {
      console.error('Error saving voting state to Firebase:', error);
      // Continue with local state even if Firebase fails
    }
  };

  const setVotingEndTime = async (time: Date | null) => {
    setVotingEndTimeState(time);
    try {
      await setVotingState({ currentVotingTeam, isVotingActive, votingEndTime: time });
    } catch (error) {
      console.error('Error saving voting state to Firebase:', error);
      // Continue with local state even if Firebase fails
    }
  };

  const endVoting = async () => {
    const newEndTime = new Date();
    setIsVotingActiveState(false);
    setVotingEndTimeState(newEndTime);
    
    try {
      await setVotingState({ currentVotingTeam, isVotingActive: false, votingEndTime: newEndTime });
    } catch (error) {
      console.error('Error saving voting state to Firebase:', error);
      // Continue with local state even if Firebase fails
    }
    
    // Clear current voting team after 10 seconds
    setTimeout(async () => {
      setCurrentVotingTeamState(null);
      try {
        await setVotingState({ currentVotingTeam: null, isVotingActive: false, votingEndTime: newEndTime });
      } catch (error) {
        console.error('Error clearing voting state in Firebase:', error);
      }
    }, 10000);
  };

  return (
    <VotingControlContext.Provider value={{ 
      currentVotingTeam, 
      isVotingActive, 
      votingEndTime,
      isLoading,
      setCurrentVotingTeam, 
      setIsVotingActive, 
      setVotingEndTime,
      endVoting,
      refreshVotingState
    }}>
      {children}
    </VotingControlContext.Provider>
  );
};

export const useVotingControl = () => {
  const context = useContext(VotingControlContext);
  if (context === undefined) {
    throw new Error('useVotingControl must be used within a VotingControlProvider');
  }
  return context;
};