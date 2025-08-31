import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

console.log('🔧 Set Voting State API: adminDb imported:', !!adminDb);

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Set Voting State API: Starting POST request');
    console.log('🔧 Set Voting State API: adminDb available:', !!adminDb);
    
    const { state } = await request.json();

    if (!state) {
      return NextResponse.json({ error: 'Voting state is required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('❌ Set Voting State API: Admin database not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // Set voting state
    await adminDb.collection('votingState').doc('current').set({
      ...state,
      updatedAt: new Date()
    });
    console.log('✅ Set Voting State API: Voting state set successfully');

    return NextResponse.json({ success: true, message: 'Voting state set successfully' });
  } catch (error) {
    console.error('Error setting voting state:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}