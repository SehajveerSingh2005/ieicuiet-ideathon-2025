"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Team {
  id: string;
  name: string;
  members: string;
  projectDescription: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Vote {
  id: string;
  teamId: string;
  rating: number;
  voterTeamId: string;
  createdAt: Timestamp;
}

interface FirebaseFirestoreContextType {
  teams: Team[];
  votes: Vote[];
  loading: boolean;
  error: string | null;
  addTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addVote: (teamId: string, rating: number, voterTeamId: string) => Promise<string>;
  updateVote: (voteId: string, newRating: number) => Promise<void>;
  deleteVote: (voteId: string) => Promise<void>;
  getTeamVotes: (teamId: string) => Vote[];
  getVoteCount: (teamId: string) => number;
  getAverageRating: (teamId: string) => number;
  hasVoted: (teamId: string, voterTeamId: string) => boolean;
  canVote: (teamId: string, voterTeamId: string) => boolean;
  getTeamByEmail: (email: string) => Team | null;
  // Admin operations
  adminDeleteTeam: (teamId: string) => Promise<{ deletedTeamEmail?: string }>;
  adminDeleteVote: (voteId: string) => Promise<void>;
  adminUpdateVote: (voteId: string, newRating: number) => Promise<void>;
  // Voting state management
  getVotingState: () => Promise<{ currentVotingTeam: { id: string; name: string } | null; isVotingActive: boolean; votingEndTime: Date | null }>;
  setVotingState: (state: { currentVotingTeam: { id: string; name: string } | null; isVotingActive: boolean; votingEndTime: Date | null }) => Promise<void>;
  // Leaderboard visibility management
  getLeaderboardVisibility: () => Promise<boolean>;
  setLeaderboardVisibility: (visible: boolean) => Promise<void>;
}

const FirebaseFirestoreContext = createContext<FirebaseFirestoreContextType | undefined>(undefined);

export const FirebaseFirestoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to teams collection
  useEffect(() => {
    if (!db) {
      setError('Database not initialized');
      setLoading(false);
      return;
    }

    try {
      const unsubscribeTeams = onSnapshot(
        collection(db, 'teams'), 
        (snapshot) => {
          const teamsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Team[];
          setTeams(teamsData);
          setError(null);
        },
        (error) => {
          console.error('Error listening to teams:', error);
          setError(`Failed to load teams: ${error.message}`);
        }
      );

      return () => unsubscribeTeams();
    } catch (error) {
      console.error('Error setting up teams listener:', error);
      setError('Failed to set up teams listener');
      setLoading(false);
    }
  }, []);

  // Listen to votes collection
  useEffect(() => {
    if (!db) {
      setError('Database not initialized');
      setLoading(false);
      return;
    }

    try {
      const unsubscribeVotes = onSnapshot(
        collection(db, 'votes'), 
        (snapshot) => {
          const votesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Vote[];
          setVotes(votesData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error listening to votes:', error);
          setError(`Failed to load votes: ${error.message}`);
          setLoading(false);
        }
      );

      return () => unsubscribeVotes();
    } catch (error) {
      console.error('Error setting up votes listener:', error);
      setError('Failed to set up votes listener');
      setLoading(false);
    }
  }, []);

  const addTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const docRef = await addDoc(collection(db, 'teams'), {
        ...teamData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding team:', error);
      throw new Error(`Failed to add team: ${error.message}`);
    }
  };

  const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error updating team:', error);
      throw new Error(`Failed to update team: ${error.message}`);
    }
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      // Delete team
      await deleteDoc(doc(db, 'teams', teamId));
      
      // Delete all votes for this team
      const teamVotes = votes.filter(vote => vote.teamId === teamId);
      for (const vote of teamVotes) {
        await deleteDoc(doc(db, 'votes', vote.id));
      }
    } catch (error: any) {
      console.error('Error deleting team:', error);
      throw new Error(`Failed to delete team: ${error.message}`);
    }
  };

  const addVote = async (teamId: string, rating: number, voterTeamId: string): Promise<string> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      // Check if team is trying to vote for themselves
      if (teamId === voterTeamId) {
        throw new Error("Teams cannot vote for themselves");
      }

      // Check if team has already voted for this team
      if (hasVoted(teamId, voterTeamId)) {
        throw new Error("You have already voted for this team");
      }

      const docRef = await addDoc(collection(db, 'votes'), {
        teamId,
        rating,
        voterTeamId,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding vote:', error);
      if (error.message.includes('Teams cannot vote') || error.message.includes('already voted')) {
        throw error;
      }
      throw new Error(`Failed to add vote: ${error.message}`);
    }
  };

  const updateVote = async (voteId: string, newRating: number): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const voteRef = doc(db, 'votes', voteId);
      await updateDoc(voteRef, {
        rating: newRating,
      });
    } catch (error: any) {
      console.error('Error updating vote:', error);
      throw new Error(`Failed to update vote: ${error.message}`);
    }
  };

  const deleteVote = async (voteId: string): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      await deleteDoc(doc(db, 'votes', voteId));
    } catch (error: any) {
      console.error('Error deleting vote:', error);
      throw new Error(`Failed to delete vote: ${error.message}`);
    }
  };

  const getTeamVotes = (teamId: string): Vote[] => {
    return votes.filter(vote => vote.teamId === teamId);
  };

  const getVoteCount = (teamId: string): number => {
    return getTeamVotes(teamId).length;
  };

  const getAverageRating = (teamId: string): number => {
    const teamVotes = getTeamVotes(teamId);
    if (teamVotes.length === 0) return 0;
    
    const sum = teamVotes.reduce((acc, vote) => acc + vote.rating, 0);
    return parseFloat((sum / teamVotes.length).toFixed(1));
  };

  const hasVoted = (teamId: string, voterTeamId: string): boolean => {
    return votes.some(vote => vote.teamId === teamId && vote.voterTeamId === voterTeamId);
  };

  const canVote = (teamId: string, voterTeamId: string): boolean => {
    // Can't vote for yourself
    if (teamId === voterTeamId) return false;
    
    // Can't vote if already voted
    if (hasVoted(teamId, voterTeamId)) return false;
    
    return true;
  };

  const getTeamByEmail = (email: string): Team | null => {
    return teams.find(team => team.email === email) || null;
  };

  // Admin operations
  const adminDeleteTeam = async (teamId: string): Promise<{ deletedTeamEmail?: string }> => {
    try {
      // Get team data before deletion to return the email
      const teamToDelete = teams.find(team => team.id === teamId);
      
      const response = await fetch('/api/admin/delete-team', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete team');
      }

      // Remove from local state after successful deletion
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
      setVotes(prevVotes => prevVotes.filter(vote => vote.teamId !== teamId));
      
      return { deletedTeamEmail: teamToDelete?.email };
    } catch (error: any) {
      console.error('Error deleting team:', error);
      throw new Error(`Failed to delete team: ${error.message}`);
    }
  };

  const adminDeleteVote = async (voteId: string): Promise<void> => {
    try {
      const response = await fetch('/api/admin/delete-vote', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete vote');
      }

      // Remove from local state after successful deletion
      setVotes(prevVotes => prevVotes.filter(vote => vote.id !== voteId));
    } catch (error: any) {
      console.error('Error deleting vote:', error);
      throw new Error(`Failed to delete vote: ${error.message}`);
    }
  };

  const adminUpdateVote = async (voteId: string, newRating: number): Promise<void> => {
    try {
      const response = await fetch('/api/admin/update-vote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteId, newRating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update vote');
      }

      // Update local state after successful update
      setVotes(prevVotes => prevVotes.map(vote => 
        vote.id === voteId ? { ...vote, rating: newRating } : vote
      ));
    } catch (error: any) {
      console.error('Error updating vote:', error);
      throw new Error(`Failed to update vote: ${error.message}`);
    }
  };

  // Voting state management
  const getVotingState = async (): Promise<{ currentVotingTeam: { id: string; name: string } | null; isVotingActive: boolean; votingEndTime: Date | null }> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const docRef = doc(db, 'votingState', 'current');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          currentVotingTeam: data.currentVotingTeam || null,
          isVotingActive: data.isVotingActive || false,
          votingEndTime: data.votingEndTime ? new Date(data.votingEndTime.toDate()) : null,
        };
      }
      return { currentVotingTeam: null, isVotingActive: false, votingEndTime: null };
    } catch (error: any) {
      console.error('Error getting voting state:', error);
      throw new Error(`Failed to get voting state: ${error.message}`);
    }
  };

  const setVotingState = async (state: { currentVotingTeam: { id: string; name: string } | null; isVotingActive: boolean; votingEndTime: Date | null }): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      console.log('🔥 FirebaseFirestore: setVotingState called with:', state);
      const docRef = doc(db, 'votingState', 'current');
      console.log('🔥 FirebaseFirestore: Document reference:', docRef);
      
      const dataToSet = {
        currentVotingTeam: state.currentVotingTeam || null,
        isVotingActive: state.isVotingActive,
        votingEndTime: state.votingEndTime ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      };
      console.log('🔥 FirebaseFirestore: Data to set:', dataToSet);
      
      await setDoc(docRef, dataToSet);
      console.log('✅ FirebaseFirestore: setVotingState completed successfully');
    } catch (error: any) {
      console.error('❌ FirebaseFirestore: Error setting voting state:', error);
      throw new Error(`Failed to set voting state: ${error.message}`);
    }
  };

  // Leaderboard visibility management
  const getLeaderboardVisibility = async (): Promise<boolean> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const docRef = doc(db, 'appSettings', 'leaderboard');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.isVisible ?? true; // Default to visible
      }
      return true; // Default to visible
    } catch (error: any) {
      console.error('Error getting leaderboard visibility:', error);
      return true; // Default to visible on error
    }
  };

  const setLeaderboardVisibility = async (visible: boolean): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }

    try {
      const docRef = doc(db, 'appSettings', 'leaderboard');
      await setDoc(docRef, {
        isVisible: visible,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error setting leaderboard visibility:', error);
      throw new Error(`Failed to set leaderboard visibility: ${error.message}`);
    }
  };

  return (
    <FirebaseFirestoreContext.Provider value={{ 
      teams, 
      votes, 
      loading,
      error,
      addTeam, 
      updateTeam,
      deleteTeam,
      addVote,
      updateVote,
      deleteVote,
      getTeamVotes,
      getVoteCount,
      getAverageRating,
      hasVoted,
      canVote,
      getTeamByEmail,
      // Admin operations
      adminDeleteTeam,
      adminDeleteVote,
      adminUpdateVote,
      // Voting state management
      getVotingState,
      setVotingState,
      // Leaderboard visibility management
      getLeaderboardVisibility,
      setLeaderboardVisibility
    }}>
      {children}
    </FirebaseFirestoreContext.Provider>
  );
};

export const useFirebaseFirestore = () => {
  const context = useContext(FirebaseFirestoreContext);
  if (context === undefined) {
    throw new Error('useFirebaseFirestore must be used within a FirebaseFirestoreProvider');
  }
  return context;
};
