"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { Vote, CheckCircle, Clock, AlertCircle, Users, Lightbulb } from 'lucide-react';

interface VotingPanelProps {
  team: {
    id: string;
    name: string;
    projectDescription: string;
    members: string;
  };
  onVote: (rating: number) => void;
  isVotingActive: boolean;
  votingEndTime: Date | null;
}

export default function VotingPanel({ team, onVote, isVotingActive, votingEndTime }: VotingPanelProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useFirebaseAuth();
  const { canVote, hasVoted, getTeamByEmail } = useFirebaseFirestore();

  // Get current user's team ID
  const currentUserTeam = user?.email ? getTeamByEmail(user.email) : null;
  
  // Check if current team can vote for this team
  const canVoteForThisTeam = currentUserTeam && canVote(team.id, currentUserTeam.id);
  const hasVotedForThisTeam = currentUserTeam && hasVoted(team.id, currentUserTeam.id);
  
  // Check if this is the current user's own team
  const isOwnTeam = currentUserTeam?.id === team.id;
  
  // Debug logging
  console.log('🔍 VotingPanel Debug:', {
    teamId: team.id,
    userEmail: user?.email,
    currentUserTeamId: currentUserTeam?.id,
    isOwnTeam,
    canVoteForThisTeam,
    hasVotedForThisTeam
  });

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleVoteSubmit = async () => {
    if (selectedRating === null || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onVote(selectedRating);
      setSelectedRating(null);
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-destructive';
    if (rating <= 3) return 'text-warning';
    if (rating <= 4) return 'text-info';
    return 'text-success';
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  const getRatingDescription = (rating: number) => {
    if (rating === 1) return 'Significant issues, needs major improvements';
    if (rating === 2) return 'Some good aspects, but several problems';
    if (rating === 3) return 'Solid work, room for improvement';
    if (rating === 4) return 'High quality, minor improvements possible';
    if (rating === 5) return 'Outstanding work, exceptional quality';
    return '';
  };

  // If this is the current user's own team, prevent voting
  if (isOwnTeam) {
    return (
      <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <CardTitle className="text-xl text-warning">Cannot Vote for Own Team</CardTitle>
          <CardDescription className="text-base">
            You cannot vote for your own team
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Teams are not allowed to vote for themselves. Please wait for other teams to present.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If team has already voted for this team
  if (hasVotedForThisTeam) {
    return (
      <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-xl text-success">
            Already Voted
          </CardTitle>
          <CardDescription className="text-base">
            You have already submitted your vote for {team.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Your vote has been recorded. Please wait for the next team to present.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If current team cannot vote for this team (e.g., already voted for another team)
  if (!canVoteForThisTeam) {
    return (
      <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-info/10 mb-4">
            <AlertCircle className="w-8 h-8 text-info" />
          </div>
          <CardTitle className="text-xl text-info">Cannot Vote</CardTitle>
          <CardDescription className="text-base">
            You have already voted for this team
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Please wait for the next team to present or check the leaderboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Vote className="w-10 h-10 text-primary" />
        </div>
        
        <CardTitle className="text-3xl font-bold">Vote for {team.name}</CardTitle>
        <CardDescription className="text-xl">
          Rate this team's presentation and project
        </CardDescription>
        
        {/* Voting Status Badge */}
        <div className="mt-4">
          {isVotingActive ? (
            <Badge className="bg-success text-success-foreground px-4 py-2 text-sm font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Voting Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Voting Paused
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Team Information */}
        <div className="bg-muted/30 rounded-xl p-6 border border-muted-foreground/20">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Users className="w-5 h-5 text-primary mr-2" />
            Team Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Team Members</h4>
              <div className="space-y-1">
                {team.members.split('\n').map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{member.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 text-success mr-2" />
                Project
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {team.projectDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Selection */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Select Your Rating</h3>

          {/* Rating Buttons */}
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating)}
                className={`
                  relative w-16 h-16 rounded-2xl border-2 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20
                  ${selectedRating === rating
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'border-muted-foreground/30 bg-background hover:border-primary/50 hover:bg-primary/5'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xl font-bold">{rating}</span>
                  <span className="text-xs opacity-80">{getRatingLabel(rating)}</span>
                </div>
                
                {/* Selection indicator */}
                {selectedRating === rating && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selected Rating Details */}
          {selectedRating && (
            <div className={`
              text-center p-4 rounded-xl border
              ${getRatingColor(selectedRating) === 'text-destructive'
                ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : getRatingColor(selectedRating) === 'text-warning'
                ? 'bg-warning/10 border-warning/20 text-warning'
                : getRatingColor(selectedRating) === 'text-info'
                ? 'bg-info/10 border-info/20 text-info'
                : 'bg-success/10 border-success/20 text-success'}
            `}>
              <h4 className={`font-semibold mb-2 ${getRatingColor(selectedRating)}`}>
                Rating {selectedRating}: {getRatingLabel(selectedRating)}
              </h4>
              <p className={`text-sm ${getRatingColor(selectedRating)}/70`}>
                {getRatingDescription(selectedRating)}
              </p>
            </div>
          )}
          </div>
        </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleVoteSubmit}
          disabled={!selectedRating || !isVotingActive || isSubmitting}
          className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Submitting Vote...
            </>
          ) : (
            <>
              <Vote className="mr-2 h-5 w-5" />
          Submit Vote
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}