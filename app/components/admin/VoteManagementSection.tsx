"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { Star, Edit, Trash2, Save, X, Users, Vote, TrendingUp } from 'lucide-react';

export default function VoteManagementSection() {
  const { teams, votes, adminUpdateVote, adminDeleteVote, getTeamVotes } = useFirebaseFirestore();
  const [editingVote, setEditingVote] = useState<{ voteId: string; currentRating: number } | null>(null);
  const [newRating, setNewRating] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEditVote = (voteId: string, currentRating: number) => {
    setEditingVote({ voteId, currentRating });
    setNewRating(currentRating);
  };

  const handleSaveVote = async () => {
    if (!editingVote || newRating === 0) return;
    
    setIsUpdating(true);
    
    try {
      await adminUpdateVote(editingVote.voteId, newRating);
      setEditingVote(null);
      setNewRating(0);
      alert('Vote updated successfully!');
    } catch (error: any) {
      console.error('Error updating vote:', error);
      alert(`Failed to update vote: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteVote = async (voteId: string) => {
    if (!confirm('Are you sure you want to delete this vote? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(voteId);
    
    try {
      await adminDeleteVote(voteId);
      alert('Vote deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting vote:', error);
      alert(`Failed to delete vote: ${error.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const cancelEdit = () => {
    setEditingVote(null);
    setNewRating(0);
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

  // Get all teams that have votes
  const teamsWithVotes = teams.filter(team => getTeamVotes(team.id).length > 0);

  if (teamsWithVotes.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/10 mb-4">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">No Votes Yet</CardTitle>
          <CardDescription className="text-base">
            No teams have received votes yet. Votes will appear here once teams start voting.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl flex items-center">
          <Vote className="w-6 h-6 text-success mr-2" />
          Vote Management
        </CardTitle>
        <CardDescription className="text-base">
          Manually edit or delete votes for any team. <span className="text-warning font-semibold">⚠️ Use this power responsibly!</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {teamsWithVotes.map((team) => {
          const teamVotes = getTeamVotes(team.id);
          
          return (
            <div key={team.id} className="space-y-4">
              {/* Team Header */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-muted-foreground/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {teamVotes.length} vote{teamVotes.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">
                    Avg: {teamVotes.reduce((sum, vote) => sum + vote.rating, 0) / teamVotes.length}
                  </span>
                </div>
              </div>
              
              {/* Votes List */}
              <div className="space-y-3 ml-6">
                {teamVotes.map((vote) => {
                  const voterTeam = teams.find(t => t.id === vote.voterTeamId);
                  
                  return (
                    <div 
                      key={vote.id}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-muted-foreground/10"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Voter Team */}
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {voterTeam?.name || 'Unknown Team'}
                          </span>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <Star className={`w-4 h-4 ${getRatingColor(vote.rating)}`} />
                          <span className={`text-sm font-semibold ${getRatingColor(vote.rating)}`}>
                            {vote.rating} - {getRatingLabel(vote.rating)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {editingVote?.voteId === vote.id ? (
                          <div className="flex items-center space-x-2">
                            <Select value={newRating.toString()} onValueChange={(value) => setNewRating(Number(value))}>
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Fair</SelectItem>
                                <SelectItem value="3">3 - Good</SelectItem>
                                <SelectItem value="4">4 - Very Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              onClick={handleSaveVote}
                              size="sm"
                              disabled={isUpdating}
                              className="btn-animate bg-success text-success-foreground hover:bg-success/90"
                            >
                              {isUpdating ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                            </Button>
                            
                            <Button
                              onClick={cancelEdit}
                              size="sm"
                              variant="outline"
                              className="btn-animate"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEditVote(vote.id, vote.rating)}
                              size="sm"
                              variant="outline"
                              className="btn-animate"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              onClick={() => handleDeleteVote(vote.id)}
                              size="sm"
                              variant="outline"
                              disabled={isDeleting === vote.id}
                              className="btn-animate border-destructive/20 text-destructive hover:bg-destructive/10"
                            >
                              {isDeleting === vote.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-destructive" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
