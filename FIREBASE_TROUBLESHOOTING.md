# Firebase Troubleshooting Guide

## 🚨 **Current Error: "Missing or insufficient permissions"**

This error occurs when Firebase Firestore rejects the connection due to security rules or configuration issues.

## 🔧 **Immediate Fixes**

### **1. Use Development Rules (Temporary)**
Copy the content from `firestore.rules.development` and paste it in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ideathon-voting-app`
3. Go to **Firestore Database** → **Rules**
4. Replace the current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT RULES - More permissive for testing
    // WARNING: Do not use in production!
    
    // Allow all operations for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish**

### **2. Check Firebase Project Setup**
Verify these services are enabled:

- ✅ **Authentication** → Sign-in method: Email/Password
- ✅ **Firestore Database** → Create database (start in test mode)
- ✅ **Project Settings** → Web app configuration

### **3. Verify Environment Variables**
Your `.env.local` looks correct, but double-check:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDsHs5K0aj5n2HiydQyiDcqOCbM786FSjI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ideathon-voting-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ideathon-voting-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ideathon-voting-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=109653469380
NEXT_PUBLIC_FIREBASE_APP_ID=1:109653469380:web:b67114bfa5d88ee1488191
```

## 🔍 **Debugging Steps**

### **Step 1: Check Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ideathon-voting-app`
3. Check if these exist:
   - **Authentication** section
   - **Firestore Database** section
   - **Web app** in Project Settings

### **Step 2: Create Firestore Database**
If Firestore doesn't exist:
1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (allows all reads/writes)
4. Select a location (choose closest to your users)
5. Click **Done**

### **Step 3: Enable Authentication**
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Save

### **Step 4: Check Web App Configuration**
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Verify web app exists and config matches `.env.local`

## 🧪 **Test the Fix**

1. **Update Firestore rules** (use development rules above)
2. **Restart your Next.js app**:
   ```bash
   npm run dev
   ```
3. **Check the home page** - you should see Firebase Status component
4. **Look for**:
   - ✅ Connection: Connected
   - ✅ Teams: 0
   - ✅ Votes: 0

## 🚀 **Production Rules (After Testing)**

Once everything works, replace the development rules with proper production rules from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Teams collection
    match /teams/{teamId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == teamId;
      allow delete: if false;
    }
    
    // Votes collection
    match /votes/{voteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.voterTeamId;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.voterTeamId;
    }
    
    // Admin collection
    match /admin/{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 📱 **App Status Indicators**

The app now includes:

- **FirebaseStatus component** on home page
- **Error boundary** for Firebase errors
- **Better error handling** in contexts
- **Connection status** display

## 🆘 **Still Having Issues?**

If the error persists:

1. **Check browser console** for more detailed error messages
2. **Verify Firebase project** is in the same region as your app
3. **Check network tab** for failed requests
4. **Try incognito mode** to rule out browser cache issues
5. **Verify Firebase project** is not paused or disabled

## 📞 **Need Help?**

Common issues and solutions:

- **"Project not found"** → Check project ID in `.env.local`
- **"Permission denied"** → Use development rules temporarily
- **"Database not found"** → Create Firestore database
- **"Authentication failed"** → Enable Email/Password sign-in

The app should work immediately after applying the development rules! 🎯
