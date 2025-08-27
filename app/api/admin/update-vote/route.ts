import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

console.log('🔧 Update Vote API: adminDb imported:', !!adminDb);

export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 Update Vote API: Starting PUT request');
    console.log('🔧 Update Vote API: adminDb available:', !!adminDb);
    
    const { voteId, newRating } = await request.json();

    if (!voteId || !newRating) {
      return NextResponse.json({ error: 'Vote ID and new rating are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('❌ Update Vote API: Admin database not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // Update vote
    await adminDb.collection('votes').doc(voteId).update({
      rating: newRating,
      updatedAt: new Date()
    });
    console.log('✅ Update Vote API: Vote updated successfully');

    return NextResponse.json({ success: true, message: 'Vote updated successfully' });
  } catch (error: any) {
    console.error('Error updating vote:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
