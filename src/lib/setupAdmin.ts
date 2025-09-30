import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const setupInitialAdmin = async () => {
  try {
    // Fixed administrator credentials
    const adminEmail = 'admin@edufee.com';
    const adminPassword = 'admin123';
    
    // Create the admin user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Update the user profile
    await updateProfile(user, { displayName: 'System Administrator' });
    
    // Save admin data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: 'System Administrator',
      email: adminEmail,
      role: 'admin',
      institutionId: 'school-001',
      createdAt: new Date().toISOString(),
      isSystemAdmin: true
    });
    
    console.log('✅ Fixed administrator account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', user.uid);
    
    return { 
      success: true, 
      userId: user.uid,
      email: adminEmail,
      password: adminPassword,
      message: 'Fixed administrator account created successfully'
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Fixed administrator account already exists');
      return { success: true, message: 'Fixed administrator account already exists' };
    }
    
    console.error('❌ Error creating fixed administrator account:', error);
    return { success: false, error: error.message };
  }
};

// Function to check if user is admin
export const checkUserRole = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};
