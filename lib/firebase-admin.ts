console.log('🚀 Firebase Admin Module: Starting to load...');

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Firebase Admin Module: Imports completed');

// Check if we're in development or production
// More robust environment detection
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.VERCEL_ENV === 'development' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ||
  (!process.env.NODE_ENV && process.env.FIREBASE_EMULATOR_HOST) ||
  (!process.env.NODE_ENV && typeof process.env.FIREBASE_DATABASE_EMULATOR_HOST !== 'undefined');

console.log('🔧 Firebase Admin: Environment:', process.env.NODE_ENV);
console.log('🔧 Firebase Admin: Is Development:', isDevelopment);

// Check if Firebase is already initialized
const existingApps = getApps();
console.log('🔧 Firebase Admin: Existing Firebase apps:', existingApps.length);

let adminApp;

if (isDevelopment) {
  // For development, use service account key file
  try {
    console.log('🔧 Firebase Admin: Attempting to load service account...');
    
    // Use readFileSync instead of require for better compatibility
    const serviceAccountPath = join(process.cwd(), 'firebase-service-account.json');
    const serviceAccountData = readFileSync(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountData);
    
    console.log('🔧 Firebase Admin: Service account loaded:', !!serviceAccount);
    console.log('🔧 Firebase Admin: Project ID:', serviceAccount.project_id);
    
    // Use a unique name for the admin app to avoid conflicts
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    }, 'firebase-admin'); // Give it a unique name
    
    console.log('✅ Firebase Admin: App initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin: Error loading service account:', error);
    console.warn('Firebase service account not found. Admin operations will be limited.');
    // Fallback to regular Firebase for development
    adminApp = null;
  }
} else {
  // For production, use environment variables
  console.log('🔧 Firebase Admin: Using production environment variables');
  try {
    // Check if required environment variables are present
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing required Firebase Admin environment variables');
    }
    
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      }),
      databaseURL: `https://${projectId}.firebaseio.com`
    }, 'firebase-admin'); // Give it a unique name
    
    console.log('✅ Firebase Admin: Production app initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin: Error initializing production app:', error);
    console.error('🔧 Firebase Admin: Environment variables check:');
    console.error('  FIREBASE_ADMIN_PROJECT_ID:', !!process.env.FIREBASE_ADMIN_PROJECT_ID);
    console.error('  FIREBASE_ADMIN_CLIENT_EMAIL:', !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    console.error('  FIREBASE_ADMIN_PRIVATE_KEY:', !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
    adminApp = null;
  }
}

console.log('🔧 Firebase Admin: Final adminApp:', !!adminApp);
console.log('🔧 Firebase Admin: Final adminDb:', !!adminApp ? 'Available' : 'Not Available');

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;

export default adminApp;
