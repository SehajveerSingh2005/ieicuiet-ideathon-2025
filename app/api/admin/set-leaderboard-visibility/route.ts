import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

console.log('🔧 Set Leaderboard Visibility API: adminDb imported:', !!adminDb);

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Set Leaderboard Visibility API: Starting POST request');
    console.log('🔧 Set Leaderboard Visibility API: adminDb available:', !!adminDb);
    
    const { visible } = await request.json();

    if (visible === undefined || visible === null) {
      return NextResponse.json({ error: 'Visibility status is required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('❌ Set Leaderboard Visibility API: Admin database not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // Set leaderboard visibility
    await adminDb.collection('appSettings').doc('leaderboard').set({
      isVisible: visible,
      updatedAt: new Date()
    });
    console.log('✅ Set Leaderboard Visibility API: Leaderboard visibility set successfully');

    return NextResponse.json({ success: true, message: 'Leaderboard visibility set successfully' });
  } catch (error) {
    console.error('Error setting leaderboard visibility:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}