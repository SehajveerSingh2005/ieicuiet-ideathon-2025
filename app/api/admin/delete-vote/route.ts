import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

console.log('🔧 Delete Vote API: adminDb imported:', !!adminDb);

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔧 Delete Vote API: Starting DELETE request');
    console.log('🔧 Delete Vote API: adminDb available:', !!adminDb);
    
    const { voteId } = await request.json();

    if (!voteId) {
      return NextResponse.json({ error: 'Vote ID is required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('❌ Delete Vote API: Admin database not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // Delete vote
    await adminDb.collection('votes').doc(voteId).delete();
    console.log('✅ Delete Vote API: Vote deleted successfully');

    return NextResponse.json({ success: true, message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
