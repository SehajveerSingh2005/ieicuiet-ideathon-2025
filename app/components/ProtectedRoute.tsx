"use client";

import React, { ReactNode } from 'react';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { User, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4">
        <Card className="max-w-md w-full border-0 bg-gradient-to-br from-muted/5 to-muted/10 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            <CardTitle className="text-2xl">Verifying Access</CardTitle>
            <CardDescription className="text-base">
              Checking your authentication status...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // If not authenticated, show access denied
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4">
        <Card className="max-w-md w-full border-0 bg-gradient-to-br from-destructive/5 to-destructive/10 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
              <User className="w-10 h-10 text-destructive" />
            </div>
            
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription className="text-base">
              Authentication required
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-3 border border-muted-foreground/20">
              <p className="text-sm text-muted-foreground text-center">
                You must be logged in to access this page.
              </p>
            </div>

            <Button 
              onClick={() => router.push('/login')}
              className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg"
            >
              <User className="mr-2 h-4 w-4" />
              Go to Login
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}