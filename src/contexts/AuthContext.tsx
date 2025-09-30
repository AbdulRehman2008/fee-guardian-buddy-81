import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'admin' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;
          
          // Only allow admin users to access the system
          if (userRole !== 'admin') {
            await signOut(auth);
            setUser(null);
            setLoading(false);
            return;
          }
          
          setUser({
            id: firebaseUser.uid,
            name: userData.name,
            email: firebaseUser.email!,
            role: userRole,
            institutionId: userData.institutionId
          });
        } else {
          // User document doesn't exist, sign them out
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if user exists in Firestore and has admin role
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await signOut(auth);
        return { success: false, message: 'User account not found. Please contact administrator.' };
      }
      
      const userData = userDoc.data();
      if (userData.role !== 'admin') {
        await signOut(auth);
        return { success: false, message: 'Access denied. Only administrators can access this system.' };
      }
      
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'An error occurred during login.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
      
      return { success: false, message };
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    try {
      // Only allow admin registration for now
      if (role !== 'admin') {
        return { success: false, message: 'Only admin accounts can be created.' };
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        institutionId: 'school-001', // Default institution
        createdAt: new Date().toISOString()
      });
      
      return { success: true, message: 'Registration successful' };
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'An error occurred during registration.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters long.';
      }
      
      return { success: false, message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};