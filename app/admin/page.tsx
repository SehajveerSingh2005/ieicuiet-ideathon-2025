"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { useVotingControl } from '@/app/context/VotingControlContext';
import { useLeaderboardVisibility } from '@/app/context/LeaderboardVisibilityContext';
import VotingControls from '@/app/components/admin/VotingControls';
import LeaderboardControls from '@/app/components/admin/LeaderboardControls';
import TeamManagementSection from '@/app/components/admin/TeamManagementSection';
import VoteManagementSection from '@/app/components/admin/VoteManagementSection';
import FirebaseTest from '@/app/components/FirebaseTest';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Vote, 
  Trophy, 
  Settings, 
  BarChart3, 
  Trash2, 
  Edit3,
  LogOut,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '@/app/context/AdminAuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { adminUser, adminLogout } = useAdminAuth();
  const { teams, votes, loading } = useFirebaseFirestore();
  const { 
    isVotingActive, 
    setIsVotingActive, 
    endVoting, 
    currentVotingTeam, 
    setCurrentVotingTeam, 
    setVotingEndTime 
  } = useVotingControl();
  const { isVisible, setIsVisible } = useLeaderboardVisibility();
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'votes'>('overview');

  // Check if user is admin using the separate admin context
  const isAdmin = !!adminUser;

  // Redirect to admin login if not authenticated as admin
  React.useEffect(() => {
    if (!isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, router]);

  const handleBackToApp = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clear old localStorage voting data that's causing issues
  const handleClearOldData = () => {
    localStorage.removeItem('currentVotingTeam');
    localStorage.removeItem('isVotingActive');
    localStorage.removeItem('votingEndTime');
    alert('Old voting data cleared successfully!');
  };

  // Reset voting state to fresh start
  const handleResetVotingState = async () => {
    if (confirm('Are you sure you want to reset the voting state? This will stop any current voting session.')) {
      try {
        await setCurrentVotingTeam(null);
        await setIsVotingActive(false);
        await setVotingEndTime(null);
        alert('Voting state reset successfully! You can now start a new voting session.');
      } catch (error) {
        console.error('Error resetting voting state:', error);
        alert('Failed to reset voting state. Please try again.');
      }
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 bg-gradient-to-br from-destructive/5 to-destructive/10 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-3 border border-muted-foreground/20">
              <p className="text-sm text-muted-foreground text-center">
                Admin access is required to view this page. Please contact the event organizers.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleBackToApp}
                className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="w-full btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalTeams = teams.length;
  const totalVotes = votes.length;
  const averageRating = totalVotes > 0 
    ? (votes.reduce((sum, vote) => sum + vote.rating, 0) / totalVotes).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToApp}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Event Control & Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{adminUser?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger 
              value="votes" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Vote className="w-4 h-4 mr-2" />
              Votes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-primary">Total Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{totalTeams}</div>
                  <p className="text-xs text-muted-foreground">Registered participants</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-success">Total Votes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{totalVotes}</div>
                  <p className="text-xs text-muted-foreground">Votes cast</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-warning">Avg Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">{averageRating}</div>
                  <p className="text-xs text-muted-foreground">Out of 5 stars</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-info/5 to-info/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-info">Voting Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={isVotingActive ? 'default' : 'secondary'} className="text-sm">
                    {isVotingActive ? 'Active' : 'Paused'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Current state</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 bg-gradient-to-br from-muted/10 to-muted/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 text-primary mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Button
                    onClick={handleResetVotingState}
                    variant="outline"
                    className="w-full btn-animate border-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Voting State
                  </Button>
                  
                  <Button
                    onClick={handleClearOldData}
                    variant="outline"
                    className="w-full btn-animate border-2 border-warning/20 text-warning hover:bg-warning/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Old Data
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/init-voting-state', { method: 'POST' });
                        if (response.ok) {
                          alert('Voting state initialized in Firebase!');
                          // Refresh the voting state
                          window.location.reload();
                        } else {
                          alert('Failed to initialize voting state');
                        }
                      } catch (error) {
                        console.error('Error initializing voting state:', error);
                        alert('Failed to initialize voting state');
                      }
                    }}
                    variant="outline"
                    className="w-full btn-animate border-2 border-info/20 text-info hover:bg-info/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Init Voting State
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('teams')}
                    variant="outline"
                    className="w-full btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Teams
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('votes')}
                    variant="outline"
                    className="w-full btn-animate border-2 border-success/20 text-success hover:bg-success/10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Votes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voting Controls */}
            <VotingControls />

            {/* Leaderboard Controls */}
            <LeaderboardControls />
            
            {/* Firebase Test */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  🔧 Firebase Debug
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Test Firebase connection and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FirebaseTest />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <TeamManagementSection />
          </TabsContent>

          {/* Votes Tab */}
          <TabsContent value="votes">
            <VoteManagementSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}