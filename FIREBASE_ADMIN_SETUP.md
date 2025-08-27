# Firebase Admin Setup Instructions

## 🔥 **Step 1: Get Service Account Key**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (Project Settings)
4. Go to "Service Accounts" tab
5. Click "Generate new private key"
6. Download the JSON file
7. **Save it as `firebase-service-account.json` in your project root**

## 🔥 **Step 2: Update Environment Variables**

Add these to your `.env.local`:

```bash
# Firebase Admin Config (for production)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
```

## 🔥 **Step 3: Update Firebase Security Rules**

Make sure your `firestore.rules` allow admin operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin operations from server
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔥 **Step 4: Test Admin Operations**

Now you can:
- ✅ Delete teams with proper admin privileges
- ✅ Edit votes with proper admin privileges  
- ✅ All operations go through secure API routes
- ✅ No more permission errors!

## 🔥 **How It Works**

1. **Client-side**: Admin operations call API routes
2. **Server-side**: API routes use Firebase Admin SDK with service account
3. **Security**: Service account has full admin privileges
4. **Local State**: UI updates immediately after successful operations

## 🔥 **Production Notes**

- Keep `firebase-service-account.json` out of version control
- Use environment variables in production
- Service account has full access - use responsibly!
