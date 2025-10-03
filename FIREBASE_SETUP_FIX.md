# 🔧 Firebase Configuration Fix Guide

## 🚨 **Current Issue**
You're getting `auth/configuration-not-found` and 400 Bad Request errors because Firebase services are not properly configured in your Firebase project.

## ✅ **Step-by-Step Fix**

### **Step 1: Go to Firebase Console**
1. Open your browser and go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Select your project: `fess-manegment-system`

### **Step 2: Enable Authentication**
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"** or **"Sign-in method"**
3. Click on **"Email/Password"**
4. **Enable** Email/Password authentication
5. Click **"Save"**

### **Step 3: Enable Firestore Database**
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose the closest to you)
5. Click **"Done"**

### **Step 4: Set Up Security Rules**
1. In Firestore Database, click **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### **Step 5: Verify Project Settings**
1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Make sure your web app is listed
5. If not, click **"Add app"** → **"Web"** and register your app

### **Step 6: Check API Keys**
1. In Project settings, go to **"Service accounts"** tab
2. Make sure the Firebase Admin SDK is properly configured

## 🔍 **Verify Your Configuration**

Your Firebase config in `src/lib/firebase.ts` should match your project settings:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBTlqN4cUIIAUTSaluPyEbxKW4guH8w06Y",
  authDomain: "fess-manegment-system.firebaseapp.com",
  projectId: "fess-manegment-system",
  storageBucket: "fess-manegment-system.firebasestorage.app",
  messagingSenderId: "406261430464",
  appId: "1:406261430464:web:ed74d07e95b21f99405525",
  measurementId: "G-ZLH8H4Q6F4"
};
```

## 🧪 **Test the Fix**

1. **Refresh your browser** (http://localhost:5173)
2. **Try to register** a new account
3. **Check the browser console** for any remaining errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: "auth/configuration-not-found"**
- **Solution**: Enable Authentication in Firebase Console
- **Steps**: Authentication → Sign-in method → Enable Email/Password

### **Issue 2: "400 Bad Request" for Firestore**
- **Solution**: Enable Firestore Database
- **Steps**: Firestore Database → Create database → Test mode

### **Issue 3: "Permission denied"**
- **Solution**: Update Firestore security rules
- **Steps**: Firestore → Rules → Update rules → Publish

### **Issue 4: "Project not found"**
- **Solution**: Check project ID in Firebase config
- **Steps**: Project settings → General → Project ID

## 📱 **Alternative: Use Firebase Emulator (Local Development)**

If you want to develop offline, you can use Firebase Emulator:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

Then update your `src/lib/firebase.ts`:

```typescript
import { connectAuthEmulator, connectFirestoreEmulator } from 'firebase/auth';

// After initializing Firebase
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 🎯 **Expected Result**

After completing these steps:
- ✅ Registration should work
- ✅ Login should work
- ✅ Data should sync in real-time
- ✅ No more 400 errors in console

## 📞 **Still Having Issues?**

1. **Check Firebase Console** for any error messages
2. **Verify your internet connection**
3. **Clear browser cache and cookies**
4. **Check if Firebase services are available** (https://status.firebase.google.com/)

## 🔒 **Security Note**

The current rules allow all authenticated users to read/write all data. For production:
1. Implement proper role-based access control
2. Add data validation rules
3. Set up proper user permissions

---

**After completing these steps, your Firebase integration should work perfectly! 🚀**
