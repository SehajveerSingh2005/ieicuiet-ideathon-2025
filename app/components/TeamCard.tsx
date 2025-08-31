"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Users, Lightbulb, Star } from 'lucide-react';

interface TeamCardProps {
  name: string;
}

export default function TeamCard({ name }: TeamCardProps) {
  return (
    <Card className="card-hover border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                {name}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Innovation Team
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-warning">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4 sm:space-y-6">
        {/* Innovation Badge */}
        <div className="flex justify-center pt-1 sm:pt-2">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/20">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Innovative Solution
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}