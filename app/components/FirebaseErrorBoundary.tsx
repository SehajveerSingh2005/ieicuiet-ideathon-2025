"use client";

import React, { Component, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 bg-gradient-to-br from-destructive/5 to-destructive/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                <Database className="w-10 h-10 text-destructive" />
              </div>
              
              <CardTitle className="text-2xl text-destructive">Firebase Connection Error</CardTitle>
              <CardDescription className="text-base">
                Unable to connect to the database
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-xl p-4 border border-muted-foreground/20">
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-warning mr-2" />
                  What happened?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The app couldn't connect to Firebase. This usually means:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Firebase project isn't configured</li>
                  <li>• Security rules are too restrictive</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full btn-animate bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg h-12 text-lg font-semibold"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
                >
                  Go to Home
                </Button>
              </div>

              {this.state.error && (
                <details className="bg-muted/20 rounded-lg p-3 border border-muted-foreground/20">
                  <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
