"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Users, Lightbulb, Star } from 'lucide-react';

interface TeamCardProps {
  name: string;
  projectDescription: string;
  members: string;
}

export default function TeamCard({ name, projectDescription, members }: TeamCardProps) {
  const memberList = members.split('\n').filter(member => member.trim());

  return (
    <Card className="card-hover border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Innovation Team
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-warning">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Project Description */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-foreground flex items-center">
            <Lightbulb className="w-5 h-5 text-primary mr-2" />
            Project Overview
          </h4>
          <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-muted-foreground leading-relaxed">
              {projectDescription}
            </p>
          </div>
        </div>
        
        {/* Team Members */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-foreground flex items-center">
            <Users className="w-5 h-5 text-secondary-foreground mr-2" />
            Team Members
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {memberList.map((member, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-muted/30 rounded-lg px-3 py-2 border border-muted-foreground/20"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  {member.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Innovation Badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Innovative Solution
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}