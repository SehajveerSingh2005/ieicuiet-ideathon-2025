"use client";

import { useState } from 'react';
import { useFirebaseFirestore } from '@/app/context/FirebaseFirestoreContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

export default function FirebaseTest() {
  const { getVotingState, setVotingState } = useFirebaseFirestore();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      // Test reading voting state
      const state = await getVotingState();
      setTestResult(`✅ Read successful: ${JSON.stringify(state)}`);
      
      // Test writing voting state
      await setVotingState({
        currentVotingTeam: { id: 'test', name: 'Test Team' },
        isVotingActive: true,
        votingEndTime: null
      });
      setTestResult(prev => prev + '\n✅ Write successful!');
      
      // Test reading back
      const newState = await getVotingState();
      setTestResult(prev => prev + `\n✅ Read back successful: ${JSON.stringify(newState)}`);
      
    } catch (error) {
      setTestResult(`❌ Error: ${(error as Error).message}`);
      console.error('Firebase test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetTestData = async () => {
    setLoading(true);
    try {
      await setVotingState({
        currentVotingTeam: null,
        isVotingActive: false,
        votingEndTime: null
      });
      setTestResult('✅ Test data reset successfully!');
    } catch (error) {
      setTestResult(`❌ Error resetting: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testFirebaseConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </Button>
        
        <Button 
          onClick={resetTestData} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          Reset Test Data
        </Button>
        
        {testResult && (
          <div className="p-3 bg-muted rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
