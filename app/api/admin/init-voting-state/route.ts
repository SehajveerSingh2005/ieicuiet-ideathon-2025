import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

console.log('🔧 Init Voting State API: adminDb imported:', !!adminDb);

export async function POST() {
  try {
    console.log('🔧 Init Voting State API: Starting POST request');
    console.log('🔧 Init Voting State API: adminDb available:', !!adminDb);
    
    if (!adminDb) {
      console.error('❌ Init Voting State API: Admin database not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // Initialize the voting state document
    const docRef = adminDb.collection('votingState').doc('current');
    
    // Check if document exists
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      // Create initial voting state
      await docRef.set({
        currentVotingTeam: null,
        isVotingActive: false,
        votingEndTime: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Init Voting State API: Voting state initialized successfully');
    } else {
      console.log('ℹ️ Init Voting State API: Voting state already exists');
    }

    return NextResponse.json({ success: true, message: 'Voting state initialized' });
  } catch (error) {
    console.error('Error initializing voting state:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
