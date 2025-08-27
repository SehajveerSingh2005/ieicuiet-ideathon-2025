"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { 
  Users, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  AlertTriangle,
  User,
  Lightbulb,
  Calendar,
  MapPin
} from 'lucide-react';

interface TeamProfileProps {
  team: {
    id: string;
    name: string;
    members: string;
    projectDescription: string;
    createdAt: any;
  };
  onEditComplete?: () => void;
}

export default function TeamProfile({ team, onEditComplete }: TeamProfileProps) {
  const { updateTeam } = useFirebaseFirestore();
  const { user } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: team.name || '',
    members: team.members || '',
    projectDescription: team.projectDescription || ''
  });

  useEffect(() => {
    setFormData({
      name: team.name || '',
      members: team.members || '',
      projectDescription: team.projectDescription || ''
    });
  }, [team]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: team.name,
      members: team.members,
      projectDescription: team.projectDescription
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.members.trim() || !formData.projectDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateTeam(team.id, formData);
      setIsEditing(false);
      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Failed to update team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Team Profile</CardTitle>
              <CardDescription className="text-base">
                Your team registration details
              </CardDescription>
            </div>
          </div>
          
          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isEditing ? (
          // Edit Form
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Team Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter team name"
                  className="border-2 border-muted-foreground/20 focus:border-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Team Members</label>
                <Textarea
                  value={formData.members}
                  onChange={(e) => handleInputChange('members', e.target.value)}
                  placeholder="Enter team members (one per line)"
                  rows={3}
                  className="border-2 border-muted-foreground/20 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">
                  Enter each member's name on a new line
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Project Description</label>
              <Textarea
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder="Describe your project idea"
                rows={4}
                className="border-2 border-muted-foreground/20 focus:border-primary/50"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleCancel}
                variant="outline"
                className="btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Display Mode
          <div className="space-y-6">
            {/* Team Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{team.name || 'Unnamed Team'}</h3>
                    <p className="text-sm text-muted-foreground">Team Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      {(team.members || '').split('\n').filter(m => m.trim()).length} Member{(team.members || '').split('\n').filter(m => m.trim()).length !== 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-foreground">
                      {formatDate(team.createdAt)}
                    </h4>
                    <p className="text-sm text-muted-foreground">Registration Date</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center mt-1">
                    <Lightbulb className="w-5 h-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-foreground mb-2">Project Description</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {team.projectDescription || 'No project description provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Members List */}
            <div className="bg-muted/30 rounded-lg p-4 border border-muted-foreground/20">
              <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                <Users className="w-5 h-5 text-primary mr-2" />
                Team Members
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(team.members || '').split('\n').filter(m => m.trim()).map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{member.trim()}</span>
                  </div>
                ))}
                {!team.members || team.members.trim() === '' && (
                  <p className="text-muted-foreground text-sm">No team members listed</p>
                )}
              </div>
            </div>
            
            {/* Status */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <div>
                  <h4 className="font-medium text-success">Registration Complete</h4>
                  <p className="text-sm text-success/70">
                    Your team is successfully registered and ready to participate in the ideathon!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-info mt-1" />
                <div>
                  <h4 className="font-medium text-info">Next Steps</h4>
                  <ul className="text-sm text-info/70 mt-2 space-y-1">
                    <li>• Wait for the voting session to begin</li>
                    <li>• Present your project to other teams</li>
                    <li>• Vote for other teams' projects</li>
                    <li>• Check the leaderboard for results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
