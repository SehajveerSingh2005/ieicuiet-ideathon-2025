"use client";

import { useState } from 'react';
import { useVotingControl } from '@/app/context/VotingControlContext';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import VotingPanel from '@/app/components/voting/VotingPanel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Vote, Users, Clock, AlertTriangle, CheckCircle, Trophy } from 'lucide-react';

export default function VotePage() {
  const { currentVotingTeam, isVotingActive, votingEndTime } = useVotingControl();
  const { teams, addVote, getTeamByEmail } = useFirebaseFirestore();
  const { user } = useFirebaseAuth();
  const [showTeamSelector, setShowTeamSelector] = useState(false);

  // Debug logging
  console.log('🎯 VotePage: currentVotingTeam:', currentVotingTeam);
  console.log('🎯 VotePage: isVotingActive:', isVotingActive);
  console.log('🎯 VotePage: votingEndTime:', votingEndTime);
  console.log('🎯 VotePage: teams count:', teams.length);

  const handleVote = async (rating: number) => {
    if (!user || !currentVotingTeam) return;

    // Get current user's team
    const currentUserTeam = getTeamByEmail(user.email!);
    if (!currentUserTeam) {
      alert('Error: Could not find your team. Please try logging in again.');
      return;
    }

    try {
      // Submit the vote to Firebase using team ID instead of user UID
      await addVote(currentVotingTeam.id, rating, currentUserTeam.id);
      
      // Show success message
      alert(`Vote submitted successfully! You rated ${currentVotingTeam.name} ${rating}/5 stars.`);
      
      // Optionally redirect to leaderboard or refresh the page
      // window.location.href = '/leaderboard';
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert(`Failed to submit vote: ${(error as Error).message}`);
    }
  };

  // If no team is currently presenting
  if (!currentVotingTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-to-br from-muted/5 to-muted/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              
              <CardTitle className="text-2xl">No Team Currently Presenting</CardTitle>
              <CardDescription className="text-base">
                Please wait for the next team to begin their presentation at Cre&apos;oVate 2025
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                The voting session will begin once a team starts presenting. 
                Check back later or ask the event organizers for updates.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowTeamSelector(!showTeamSelector)}
                  variant="outline"
                  className="btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  {showTeamSelector ? 'Hide Team List' : 'View All Teams'}
                </Button>
                
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="btn-animate border-2 border-blue-20 text-blue-600 hover:bg-blue-10"
                >
                  🔄 Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team List (Optional) */}
          {showTeamSelector && (
            <div className="mt-8">
              <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 text-primary mr-2" />
                    Registered Teams
                  </CardTitle>
                  <CardDescription>
                    {teams.length} team{teams.length !== 1 ? 's' : ''} registered for the event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                      <div 
                        key={team.id}
                        className="p-4 bg-muted/30 rounded-lg border border-muted-foreground/20"
                      >
                        <h3 className="font-semibold text-foreground mb-2">{team.name}</h3>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If voting session has ended
  if (votingEndTime && new Date() > new Date(votingEndTime)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 mb-6">
                <Clock className="w-10 h-10 text-warning" />
              </div>
              
              <CardTitle className="text-2xl text-warning">Voting Session Ended</CardTitle>
              <CardDescription className="text-base">
                The voting period for {currentVotingTeam.name} has concluded
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Thank you for participating! The results will be available on the leaderboard.
              </p>
              
              <Button 
                onClick={() => window.location.href = '/leaderboard'}
                className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg"
              >
                <Trophy className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If voting is paused
  if (!isVotingActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-info/10 mb-6">
                <AlertTriangle className="w-10 h-10 text-info" />
              </div>
              
              <CardTitle className="text-2xl text-info">Voting Paused</CardTitle>
              <CardDescription className="text-base">
                Voting is currently paused for {currentVotingTeam.name}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                The voting session has been temporarily paused. 
                Please wait for it to resume or check with the event organizers.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Team: {currentVotingTeam.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get the full team details for the currently voting team
  const currentTeamDetails = teams.find(team => team.id === currentVotingTeam?.id);

  // Show voting panel when active
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <VotingPanel
          team={{
            id: currentVotingTeam.id,
            name: currentVotingTeam.name
          }}
          onVote={handleVote}
          isVotingActive={isVotingActive}
        />
      </div>
    </div>
  );
}