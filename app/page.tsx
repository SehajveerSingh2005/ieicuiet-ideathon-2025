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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-2 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              Welcome to Cre&apos;oVate 2025
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Igniting Creativity, Driving Innovations - Join the ultimate innovation challenge where teams compete, collaborate, and create the next big thing in technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <Button 
                  onClick={handleRegisterTeam}
                  className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-14 text-lg font-semibold px-8"
                >
                  <Users className="mr-2 h-6 w-6" />
                  Register Your Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleStartVoting}
                  className="btn-animate bg-gradient-to-r from-success to-success-foreground hover:from-success/90 hover:to-success-foreground/90 text-white shadow-lg h-14 text-lg font-semibold px-8"
                >
                  <Vote className="mr-2 h-6 w-6" />
                  Start Voting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Why Participate?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the thrill of competition while building real-world solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Competitive Spirit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Compete against other teams and showcase your innovative ideas to industry experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <Lightbulb className="w-8 h-8 text-success" />
                </div>
                <CardTitle className="text-xl">Innovation Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Work on cutting-edge problems and develop solutions that could change the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
                  <TrendingUp className="w-8 h-8 text-warning" />
                </div>
                <CardTitle className="text-xl">Skill Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Enhance your technical skills, teamwork, and problem-solving abilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Information Section */}
      <section className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">
            Event Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg">Date: 3 September 2025</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg">Time: 9:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg">Venue: Perrie Hall, Le Corbusier Block</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg">Event Coordinators:</span>
              </div>
              <div className="flex items-center space-x-3 pl-9">
                <span className="text-lg">1. Naman Kumar (7988115047)</span>
              </div>
              <div className="flex items-center space-x-3 pl-9">
                <span className="text-lg">2. Mayank Jindal (9501059022)</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg">Faculty Coordinator: Dr. Gagan Singla</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cre&apos;oVate 2025 brings together the brightest minds in technology for an unforgettable
            experience of innovation, collaboration, and competition. Whether you're a seasoned developer
            or a passionate newcomer, there's a place for you in this exciting event.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/5 to-primary-foreground/5 rounded-3xl p-12 border border-primary/20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Ready to Innovate?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of innovators and make your mark on the future of technology. 
              The next big breakthrough could be yours.
            </p>
            
            {!user ? (
              <Button 
                onClick={handleRegisterTeam}
                className="btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-14 text-lg font-semibold px-8"
              >
                <Users className="mr-2 h-6 w-6" />
                Register Your Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleStartVoting}
                className="btn-animate bg-gradient-to-r from-success to-success-foreground hover:from-success/90 hover:to-success-foreground/90 text-white shadow-lg h-14 text-lg font-semibold px-8"
              >
                <Vote className="mr-2 h-6 w-6" />
                Start Voting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
