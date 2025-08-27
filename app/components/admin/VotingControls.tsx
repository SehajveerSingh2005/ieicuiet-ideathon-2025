"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { useVotingControl } from '@/app/context/VotingControlContext';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { Vote, Play, Square, Users, Clock } from 'lucide-react';

export default function VotingControls() {
  const {
    currentVotingTeam,
    isVotingActive,
    setCurrentVotingTeam,
    setIsVotingActive,
    endVoting,
    setVotingEndTime,
    refreshVotingState
  } = useVotingControl();
  const { teams, getVotingState, setVotingState } = useFirebaseFirestore();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleStartVoting = async () => {
    console.log('🚀 VotingControls: Starting voting for team:', selectedTeam);
    console.log('🚀 VotingControls: Available teams:', teams);
    
    if (selectedTeam) {
      const team = teams.find(t => t.id === selectedTeam);
      console.log('🚀 VotingControls: Found team:', team);
      
      if (team) {
        try {
          console.log('🚀 VotingControls: Setting all voting state at once...');
          
          // Update local state first
          setCurrentVotingTeam({ id: team.id, name: team.name });
          setIsVotingActive(true);
          setVotingEndTime(null);
          
          // Then save to Firebase in one call
          await setVotingState({
            currentVotingTeam: { id: team.id, name: team.name },
            isVotingActive: true,
            votingEndTime: null
          });
          
          console.log('✅ VotingControls: Voting started successfully!');
          
          // Verify the state was saved by reading it back
          console.log('🔄 VotingControls: Verifying state was saved...');
          const savedState = await getVotingState();
          console.log('📋 VotingControls: Saved state:', savedState);
          
        } catch (error) {
          console.error('❌ VotingControls: Error starting voting:', error);
        }
      } else {
        console.error('❌ VotingControls: Team not found for ID:', selectedTeam);
      }
    } else {
      console.error('❌ VotingControls: No team selected');
    }
  };

  const handleEndVoting = async () => {
    await endVoting();
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Vote className="w-6 h-6 text-primary mr-2" />
          Voting Controls
        </CardTitle>
        <CardDescription>Control the voting process for teams</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select Team for Voting</label>
          <Select onValueChange={(value: string) => setSelectedTeam(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a team to present..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleStartVoting}
            disabled={!selectedTeam || isVotingActive}
            className="flex-1 btn-animate bg-gradient-to-r from-success to-success-foreground hover:from-success/90 hover:to-success-foreground/90 text-white shadow-lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Voting
          </Button>
          <Button
            onClick={handleEndVoting}
            variant="destructive"
            disabled={!isVotingActive}
            className="flex-1 btn-animate shadow-lg"
          >
            <Square className="w-4 h-4 mr-2" />
            End Voting
          </Button>
        </div>
        
        {/* Current Status */}
        {currentVotingTeam && (
          <div className="p-4 bg-gradient-to-br from-muted/20 to-muted/30 rounded-xl border border-muted-foreground/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">Current Voting Session</h4>
              <Badge variant={isVotingActive ? 'default' : 'secondary'} className="text-sm">
                {isVotingActive ? 'Active' : 'Ended'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Team:</span>
                <span className="text-sm text-primary font-semibold">{currentVotingTeam.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Status: {isVotingActive ? 'Voting is currently active' : 'Voting session has ended'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Instructions:</strong> Select a team from the dropdown above, then click "Start Voting" to begin the voting session. 
            Teams will be able to vote for the selected team until you click "End Voting".
          </p>
        </div>
      </CardContent>
    </Card>
  );
}