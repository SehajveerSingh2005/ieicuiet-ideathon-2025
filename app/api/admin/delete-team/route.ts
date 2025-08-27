import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

console.log('🔧 Delete Team API: adminDb imported:', !!adminDb);
console.log('🔧 Delete Team API: adminAuth imported:', !!adminAuth);

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔧 Delete Team API: Starting DELETE request');
    console.log('🔧 Delete Team API: adminDb available:', !!adminDb);
    console.log('🔧 Delete Team API: adminAuth available:', !!adminAuth);
    
    const { teamId } = await request.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    if (!adminDb || !adminAuth) {
      console.error('❌ Delete Team API: Admin database or auth not available');
      return NextResponse.json({ error: 'Admin services not available' }, { status: 500 });
    }

    // First, get the team data to find the email
    const teamDoc = await adminDb.collection('teams').doc(teamId).get();
    const teamData = teamDoc.data();
    
    if (!teamData) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const teamEmail = teamData.email;
    console.log('🔧 Delete Team API: Team email to delete:', teamEmail);
    
    // Delete the user from Firebase Authentication
    try {
      const userRecord = await adminAuth.getUserByEmail(teamEmail);
      await adminAuth.deleteUser(userRecord.uid);
      console.log('✅ Delete Team API: User deleted from Authentication');
    } catch (authError: any) {
      console.error('⚠️ Delete Team API: Error deleting user from auth (user might not exist):', authError.message);
      // Continue with team deletion even if auth deletion fails
    }
    
    // Delete team from Firestore
    await adminDb.collection('teams').doc(teamId).delete();
    console.log('✅ Delete Team API: Team deleted from Firestore');
    
    // Delete all votes for this team
    const votesSnapshot = await adminDb.collection('votes').where('teamId', '==', teamId).get();
    const batch = adminDb.batch();
    
    votesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Delete Team API: Team votes deleted from Firestore');

    return NextResponse.json({ 
      success: true, 
      message: 'Team, user account, and associated votes deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
