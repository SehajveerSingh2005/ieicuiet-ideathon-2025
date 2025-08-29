"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Users, Trash2, Edit, AlertTriangle, CheckCircle, X, Star } from 'lucide-react';

export default function TeamManagementSection() {
  const { teams, adminDeleteTeam, getVoteCount, getAverageRating } = useFirebaseFirestore();
  const { user, logout } = useFirebaseAuth();
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDeleteTeam = async (teamId: string) => {
    setDeletingTeamId(teamId);
    
    try {
      const result = await adminDeleteTeam(teamId);
      setShowDeleteConfirm(null);
      
      // Check if the deleted team's email matches the current user's email
      if (user && result.deletedTeamEmail && user.email === result.deletedTeamEmail) {
        alert('Your team has been deleted. You will be logged out.');
        await logout(); // Sign out the current user
        // Redirect to home page
        window.location.href = '/';
      } else {
        alert('Team deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert(`Failed to delete team: ${(error as Error).message}`);
    } finally {
      setDeletingTeamId(null);
    }
  };

  const confirmDelete = (teamId: string) => {
    setShowDeleteConfirm(teamId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  if (teams.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/10 mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">No Teams Registered</CardTitle>
          <CardDescription className="text-base">
            No teams have registered yet. Teams will appear here once they register.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl flex items-center">
          <Users className="w-6 h-6 text-primary mr-2" />
          Team Management
        </CardTitle>
        <CardDescription className="text-base">
          View, manage, and delete registered teams. <span className="text-warning font-semibold">⚠️ Deleting a team will remove all their votes permanently!</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="p-4 border border-muted-foreground/20 rounded-xl hover:border-primary/50 transition-all duration-200 bg-muted/5 hover:bg-muted/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Team Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.members.split('\n').length} member{team.members.split('\n').length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{getVoteCount(team.id)}</div>
                        <div className="text-xs text-muted-foreground">Votes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-success flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {getAverageRating(team.id)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Members:</h4>
                      <div className="text-sm text-muted-foreground">
                        {team.members.split('\n').map((member, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{member.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Project:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {team.projectDescription}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {showDeleteConfirm === team.id ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleDeleteTeam(team.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deletingTeamId === team.id}
                        className="btn-animate"
                      >
                        {deletingTeamId === team.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={cancelDelete}
                        variant="outline"
                        size="sm"
                        className="btn-animate"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => confirmDelete(team.id)}
                      variant="outline"
                      size="sm"
                      className="btn-animate border-destructive/20 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Team
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}