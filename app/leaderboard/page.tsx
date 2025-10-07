"use client";

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useLeaderboardVisibility } from '@/app/context/LeaderboardVisibilityContext';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Trophy, Users, Star, TrendingUp, Medal, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const { isVisible } = useLeaderboardVisibility();
  const { teams, votes, loading } = useFirebaseFirestore();

  // If leaderboard is hidden, show message
  if (!isVisible) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-start justify-center p-4 pt-16 sm:pt-20">
          <Card className="max-w-md w-full border-0 bg-gradient-to-br from-muted/5 to-muted/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
                <Trophy className="w-10 h-10 text-muted-foreground" />
              </div>
              
              <CardTitle className="text-2xl">Leaderboard Hidden</CardTitle>
              <CardDescription className="text-base">
                The leaderboard is currently hidden by the event organizers
                </CardDescription>
              </CardHeader>
            
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                Check back later to see the current rankings and scores.
                </p>
              </CardContent>
            </Card>
          </div>
        </ProtectedRoute>
    );
  }

  // Calculate team scores and rankings
 const getTeamScore = (teamId: string) => {
    const teamVotes = votes.filter(vote => vote.teamId === teamId);
    if (teamVotes.length === 0) return 0;
    
    const totalRating = teamVotes.reduce((sum, vote) => sum + vote.rating, 0);
    const averageRating = totalRating / teamVotes.length;
    
    // Return just the average rating as the score
    return averageRating;
  };

  const getTeamVotes = (teamId: string) => {
    return votes.filter(vote => vote.teamId === teamId);
  };

  const getAverageRating = (teamId: string) => {
    const teamVotes = getTeamVotes(teamId);
    if (teamVotes.length === 0) return 0;
    
    const sum = teamVotes.reduce((acc, vote) => acc + vote.rating, 0);
    return parseFloat((sum / teamVotes.length).toFixed(1));
  };

  const getVoteCount = (teamId: string) => {
    return getTeamVotes(teamId).length;
  };

  // Sort teams by average rating (score), with vote count as tiebreaker
  const sortedTeams = [...teams].sort((a, b) => {
    const scoreA = getTeamScore(a.id);
    const scoreB = getTeamScore(b.id);
    
    // Primary sort: by average rating (descending)
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    // Tiebreaker 1: by vote count (descending)
    const voteCountA = getVoteCount(a.id);
    const voteCountB = getVoteCount(b.id);
    if (voteCountB !== voteCountA) {
      return voteCountB - voteCountA;
    }
    
    // Tiebreaker 2: by team name (alphabetically)
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-start justify-center p-4 pt-16 sm:pt-20">
          <Card className="max-w-md w-full border-0 bg-gradient-to-br from-muted/5 to-muted/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
              
              <CardTitle className="text-2xl">Loading Leaderboard</CardTitle>
              <CardDescription className="text-base">
                Fetching the latest rankings...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-10 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 mb-5 sm:mb-6">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">
              Leaderboard
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time rankings of all participating teams at Cre'oVate 2025 based on average star ratings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-primary">Total Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-primary">{teams.length}</div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-lg">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-success">Total Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-success">{votes.length}</div>
                <p className="text-xs text-muted-foreground">Cast</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-warning">Avg Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-warning">
                  {votes.length > 0 
                    ? (votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Out of 5</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10 shadow-lg">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-info">Active Teams</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-info">
                  {teams.filter(team => getVoteCount(team.id) > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">With Votes</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          {sortedTeams.length >= 3 && (
            <div className="mb-10 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 gradient-text">Top 3 Podium</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
                {/* 2nd Place */}
                <div className="order-2 md:order-1">
                  <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-lg">
                    <CardHeader className="text-center pb-3 sm:pb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/10 mb-3 sm:mb-4">
                        <Medal className="w-7 h-7 sm:w-8 sm:h-8 text-secondary-foreground" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">2nd Place</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{sortedTeams[1]?.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium">{getAverageRating(sortedTeams[1]?.id)}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{getVoteCount(sortedTeams[1]?.id)} votes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 1st Place */}
                <div className="order-1 md:order-2">
                  <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-xl scale-105">
                    <CardHeader className="text-center pb-3 sm:pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-warning/10 mb-3 sm:mb-4">
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-warning" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">🏆 1st Place</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{sortedTeams[0]?.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                          <span className="text-base sm:text-lg font-bold">{getAverageRating(sortedTeams[0]?.id)}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{getVoteCount(sortedTeams[0]?.id)} votes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 3rd Place */}
                <div className="order-3">
                  <Card className="border-0 bg-gradient-to-br from-amber/5 to-amber/10 shadow-lg">
                    <CardHeader className="text-center pb-3 sm:pb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber/10 mb-3 sm:mb-4">
                        <Award className="w-7 h-7 sm:w-8 sm:h-8 text-amber" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">3rd Place</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{sortedTeams[2]?.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium">{getAverageRating(sortedTeams[2]?.id)}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{getVoteCount(sortedTeams[2]?.id)} votes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2" />
                Complete Rankings
              </CardTitle>
              <CardDescription>
                All teams ranked by their average star ratings
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {sortedTeams.length === 0 ? (
                <div className="text-center py-10 sm:py-12">
                  <Users className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Teams Yet</h3>
                  <p className="text-muted-foreground">
                    Teams will appear here once they register and receive votes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {sortedTeams.map((team, index) => {
                    const rank = index + 1;
                    const score = getTeamScore(team.id);
                    const avgRating = getAverageRating(team.id);
                    const voteCount = getVoteCount(team.id);
                    
                    return (
                      <div 
                        key={team.id}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                          rank <= 3 
                            ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20' 
                            : 'bg-muted/30 border-muted-foreground/20 hover:border-primary/30'
                        }`}
                      >
                        {/* Rank and Team Info */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg ${
                            rank === 1 ? 'bg-warning text-warning-foreground' :
                            rank === 2 ? 'bg-secondary text-secondary-foreground' :
                            rank === 3 ? 'bg-amber text-amber-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {rank}
                          </div>
                          
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-foreground">{team.name}</h3>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <div className="text-center">
                            <div className="text-base sm:text-lg font-bold text-primary">{score.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Score</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                              <span className="text-base sm:text-lg font-bold text-warning">{avgRating}</span>
                            </div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Avg Rating</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-base sm:text-lg font-bold text-success">{voteCount}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Votes</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}