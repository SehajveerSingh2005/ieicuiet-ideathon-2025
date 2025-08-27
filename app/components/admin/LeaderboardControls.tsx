"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useLeaderboardVisibility } from '@/app/context/LeaderboardVisibilityContext';
import { Eye, EyeOff, Trophy } from 'lucide-react';

export default function LeaderboardControls() {
  const { isVisible, setIsVisible } = useLeaderboardVisibility();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 text-warning mr-2" />
          Leaderboard Settings
        </CardTitle>
        <CardDescription>Control the visibility of the leaderboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Leaderboard Visibility</p>
            <p className="text-xs text-muted-foreground">
              {isVisible ? 'Currently visible to all users' : 'Currently hidden from users'}
            </p>
          </div>
          
          <Button
            onClick={toggleVisibility}
            variant={isVisible ? 'outline' : 'default'}
            className={`btn-animate ${
              isVisible 
                ? 'border-warning/20 text-warning hover:bg-warning/10' 
                : 'bg-warning text-warning-foreground hover:bg-warning/90'
            }`}
          >
            {isVisible ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg border border-muted-foreground/20">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> When hidden, users won't be able to see the leaderboard or current rankings.
            This is useful during voting sessions to maintain suspense.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}