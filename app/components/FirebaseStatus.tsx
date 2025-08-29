"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { CheckCircle, XCircle, AlertTriangle, Database, Users, Vote } from 'lucide-react';

const FirebaseStatus = () => {
  const { loading, error, teams, votes } = useFirebaseFirestore();
  const { user } = useFirebaseAuth();

  const getStatusColor = () => {
    if (error) return 'destructive';
    if (loading) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (error) return <XCircle className="w-4 h-4" />;
    if (loading) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Failed';
    if (loading) return 'Connecting...';
    return 'Connected';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-muted/10 to-muted/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Database className="w-5 h-5 text-primary mr-2" />
          Firebase Status
        </CardTitle>
        <CardDescription>
          Database connection and data status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection:</span>
          <Badge variant={getStatusColor()} className="flex items-center space-x-1">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </div>

        {/* Authentication Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Authentication:</span>
          <Badge variant={user ? 'default' : 'secondary'} className="flex items-center space-x-1">
            {user ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{user ? 'Authenticated' : 'Not Authenticated'}</span>
          </Badge>
        </div>

        {/* Data Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 text-primary mr-2" />
              Teams:
            </span>
            <Badge variant="outline">{teams.length}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <Vote className="w-4 h-4 text-success mr-2" />
              Votes:
            </span>
            <Badge variant="outline">{votes.length}</Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <h4 className="font-medium text-destructive mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Connection Error
            </h4>
            <p className="text-sm text-destructive/70">{error}</p>
          </div>
        )}

        {/* Troubleshooting Tips */}
        {error && (
          <div className="bg-muted/30 rounded-lg p-3 border border-muted-foreground/20">
            <h4 className="font-medium text-foreground mb-2">Troubleshooting:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Check if Firebase project is created</li>
              <li>• Verify environment variables are set</li>
              <li>• Check Firestore security rules</li>
              <li>• Ensure database is created in Firebase Console</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FirebaseStatus;
