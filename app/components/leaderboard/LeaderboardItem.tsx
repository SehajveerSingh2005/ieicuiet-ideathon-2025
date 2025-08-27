"use client";

import React from 'react';
import { Trophy, Star, Users, TrendingUp } from 'lucide-react';

interface LeaderboardItemProps {
  rank: number;
  team: {
    id: number;
    name: string;
    score: number;
    voteCount: number;
    project: string;
  };
}

export default function LeaderboardItem({ rank, team }: LeaderboardItemProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100';
    return 'bg-muted text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5" />;
    if (rank === 2) return <Trophy className="w-5 h-5" />;
    if (rank === 3) return <Trophy className="w-5 h-5" />;
    return <span className="font-bold">{rank}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-success';
    if (score >= 4.0) return 'text-info';
    if (score >= 3.5) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Outstanding';
    if (score >= 4.0) return 'Excellent';
    if (score >= 3.5) return 'Very Good';
    if (score >= 3.0) return 'Good';
    return 'Fair';
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-r from-background to-muted/20 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-muted/20 hover:to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center space-x-4">
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getRankColor(rank)} flex items-center justify-center font-bold text-lg shadow-lg`}>
          {getRankIcon(rank)}
        </div>
        
        {/* Team Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-foreground truncate">
              {team.name}
            </h3>
            {rank <= 3 && (
              <div className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Top {rank}</span>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {team.project}
          </p>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {team.voteCount} vote{team.voteCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Score Section */}
        <div className="flex-shrink-0 text-right space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(team.score)}`}>
            {team.score.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(team.score)
                    ? 'text-warning fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <div className={`text-sm font-medium ${getScoreColor(team.score)}`}>
            {getScoreLabel(team.score)}
          </div>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
    </div>
  );
}