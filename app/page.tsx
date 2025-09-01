"use client";

import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { 
  Trophy, 
  Users, 
  Vote, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  ArrowRight,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const { user } = useFirebaseAuth();

  const handleStartVoting = () => {
    window.location.href = '/vote';
  };

  const handleRegisterTeam = () => {
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-2 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4">
              Welcome to Cre'oVate 2025
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              Igniting Creativity, Driving Innovations - Join the ultimate innovation challenge where teams compete, collaborate, and create the next big thing in technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {!user ? (
                <Button 
                  onClick={handleRegisterTeam}
                  className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold px-6 sm:px-8"
                >
                  <Users className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Register Your Team
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleStartVoting}
                  className="btn-animate bg-gradient-to-r from-success to-success-foreground hover:from-success/90 hover:to-success-foreground/90 text-white shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold px-6 sm:px-8"
                >
                  <Vote className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Start Voting
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-3">
              Why Participate?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the thrill of competition while building real-world solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Competitive Spirit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  Compete against other teams and showcase your innovative ideas to industry experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-3">
                  <Lightbulb className="w-7 h-7 text-success" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Innovation Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  Work on cutting-edge problems and develop solutions that could change the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-warning/10 mb-3">
                  <TrendingUp className="w-7 h-7 text-warning" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Skill Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  Enhance your technical skills, teamwork, and problem-solving abilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/5 to-primary-foreground/5 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-primary/20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-5">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-3">
              Ready to Innovate?
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of innovators and make your mark on the future of technology. 
              The next big breakthrough could be yours.
            </p>
            
            {!user ? (
              <Button 
                onClick={handleRegisterTeam}
                className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold px-6 sm:px-8"
              >
                <Users className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Register Your Team
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleStartVoting}
                className="btn-animate bg-gradient-to-r from-success to-success-foreground hover:from-success/90 hover:to-success-foreground/90 text-white shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold px-6 sm:px-8"
              >
                <Vote className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Start Voting
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
