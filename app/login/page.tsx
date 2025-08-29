"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Users, Eye, EyeOff, ArrowLeft, AlertTriangle, Mail, Lock } from 'lucide-react';

export default function TeamLoginPage() {
  const router = useRouter();
  const { signIn } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (error) {
      setError((error as Error).message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToApp = () => {
    router.push('/');
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 bg-gradient-to-br from-background to-muted/10 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          
          <CardTitle className="text-2xl">Team Login</CardTitle>
          <CardDescription className="text-base">
            Sign back into your existing team account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Team Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team@example.com"
                  required
                  className="border-2 border-muted-foreground/20 focus:border-primary/50 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="border-2 border-muted-foreground/20 focus:border-primary/50 pr-10 pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <Button
              onClick={handleGoToRegister}
              variant="outline"
              className="w-full btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10"
            >
              <Users className="mr-2 h-4 w-4" />
              Create New Team Account
            </Button>
            
            <Button
              onClick={handleBackToApp}
              variant="ghost"
              className="w-full btn-animate text-muted-foreground hover:text-foreground hover:bg-muted/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 border border-muted-foreground/20">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Need help?</strong> If you forgot your password or can't access your account, 
              contact the event organizers for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
