"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import TeamProfile from '@/app/components/TeamProfile';
import { Users, Lightbulb, Target, ArrowRight, AlertCircle, Trophy, Vote } from 'lucide-react';

export default function TeamRegistration() {
  const router = useRouter();
  const { signUp, user } = useFirebaseAuth();
  const { addTeam } = useFirebaseFirestore();
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create Firebase auth account
      await signUp(email, password, teamName);
      
      // Add team to Firestore
      const teamId = await addTeam({
        name: teamName,
        members: teamMembers,
        projectDescription: projectDescription,
        email: email,
      });
      
      // Set registered team to show profile
      setRegisteredTeam({ id: teamId, name: teamName, members: teamMembers, projectDescription });
      
    } catch (error) {
      console.error('Error registering team:', error);
      alert(`Registration failed: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToVoting = () => {
    router.push('/vote');
  };

  const isFormValid = teamName.trim() && teamMembers.trim() && projectDescription.trim() && email.trim() && password.length >= 6;

  // Show team profile if team is registered
  if (registeredTeam || user) {
    const teamToShow = registeredTeam || { 
      id: user?.uid, 
      name: user?.displayName, 
      members: '', 
      projectDescription: '' 
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <TeamProfile team={teamToShow} />
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleGoToVoting}
              className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg px-8 py-3 text-lg font-semibold"
            >
              <Vote className="mr-2 h-5 w-5" />
              Go to Voting
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Team Registration
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join Cre'oVate and showcase your innovative project to the world.
            Register your team and start your journey to success!
          </p>
        </div>

        {/* Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Registration Details</CardTitle>
                <CardDescription className="text-base">
                  Fill in your team information and create your account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Team Name */}
                  <div className="space-y-3">
                    <label htmlFor="teamName" className="text-sm font-semibold text-foreground flex items-center">
                      <Users className="w-4 h-4 text-primary mr-2" />
                      Team Name
                    </label>
                    <Input
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter your creative team name"
                      required
                      className="h-12 text-base border-2 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center">
                      <Users className="w-4 h-4 text-secondary-foreground mr-2" />
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your team email address"
                      required
                      className="h-12 text-base border-2 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  
                  {/* Password */}
                  <div className="space-y-3">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center">
                      <Users className="w-4 h-4 text-secondary-foreground mr-2" />
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password (min 6 characters)"
                      required
                      minLength={6}
                      className="h-12 text-base border-2 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  
                  {/* Team Members */}
                  <div className="space-y-3">
                    <label htmlFor="teamMembers" className="text-sm font-semibold text-foreground flex items-center">
                      <Users className="w-4 h-4 text-secondary-foreground mr-2" />
                      Team Members
                    </label>
                    <Textarea
                      id="teamMembers"
                      value={teamMembers}
                      onChange={(e) => setTeamMembers(e.target.value)}
                      placeholder="List all team members (one per line)
Example:
John Doe - Developer
Jane Smith - Designer
Mike Johnson - Project Manager"
                      required
                      rows={4}
                      className="text-base border-2 border-muted-foreground/20 focus:border-primary/50 transition-colors resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter each team member on a new line for better organization
                    </p>
                  </div>
                  
                  {/* Project Description */}
                  <div className="space-y-3">
                    <label htmlFor="projectDescription" className="text-sm font-semibold text-foreground flex items-center">
                      <Lightbulb className="w-4 h-4 text-success mr-2" />
                      Project Description
                    </label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your innovative project idea in detail. What problem does it solve? How does it work? What makes it unique?"
                      required
                      rows={6}
                      className="text-base border-2 border-muted-foreground/20 focus:border-primary/50 transition-colors resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Be detailed and specific about your project's innovation and impact
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    type="submit" 
                    disabled={!isFormValid || isSubmitting} 
                    className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-5 w-5" />
                        Create Team Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Date: 3 September 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Time: 9:00 AM – 4:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Venue: Perrie Hall, Le Corbusier Block</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Event Coordinators: Naman Kumar (7988115047), Mayank Jindal (9501059022)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Faculty Coordinator: Dr. Gagan Singla</span>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-0 bg-gradient-to-br from-success/5 to-info/5 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-success mr-2" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-muted-foreground">Teams of 2-5 members</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-muted-foreground">Innovative tech solutions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-muted-foreground">Sustainable focus</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-muted-foreground">Real-world impact</span>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-0 bg-gradient-to-br from-warning/5 to-primary/5 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-5 h-5 text-warning mr-2" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                  <span className="text-muted-foreground">Network with experts</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                  <span className="text-muted-foreground">Showcase your skills</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                  <span className="text-muted-foreground">Win prizes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                  <span className="text-muted-foreground">Career opportunities</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
