// Firebase service functions for the fee management system
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Student, PassoutStudent, FeeStructure, Payment } from '../contexts/FeeContext';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  PASSOUT_STUDENTS: 'passoutStudents',
  FEE_STRUCTURES: 'feeStructures',
  PAYMENTS: 'payments',
  INSTITUTIONS: 'institutions'
} as const;

// Initialize default data
export const initializeDefaultData = async () => {
  try {
    // Check if data already exists
    const studentsSnapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    if (studentsSnapshot.empty) {
      // Add sample students
      const sampleStudents = [
        {
          name: 'John Doe',
          whatsappNumber: '+1234567890',
          course: 'web',
          parentName: 'Robert Doe',
          parentContact: '+1234567890',
          email: 'john.doe@email.com',
          admissionDate: '2024-01-15',
          createdAt: serverTimestamp()
        },
        {
          name: 'Jane Smith',
          whatsappNumber: '+1234567891',
          course: 'graphics',
          parentName: 'Michael Smith',
          parentContact: '+1234567891',
          email: 'jane.smith@email.com',
          admissionDate: '2024-01-16',
          createdAt: serverTimestamp()
        }
      ];

      for (const student of sampleStudents) {
        await addDoc(collection(db, COLLECTIONS.STUDENTS), student);
      }
    }

    // Check if fee structures exist
    const feeStructuresSnapshot = await getDocs(collection(db, COLLECTIONS.FEE_STRUCTURES));
    if (feeStructuresSnapshot.empty) {
      // Add sample fee structures
      const sampleFeeStructures = [
        {
          name: 'Web Development Fee Structure',
          course: 'web',
          feeTypes: [
            { id: '1', name: 'Tuition Fee', amount: 5000, frequency: 'monthly', category: 'tuition' },
            { id: '2', name: 'Transport Fee', amount: 1500, frequency: 'monthly', category: 'transport' },
            { id: '3', name: 'Library Fee', amount: 500, frequency: 'yearly', category: 'library' }
          ],
          totalAmount: 7000,
          createdAt: serverTimestamp()
        },
        {
          name: 'Graphics Design Fee Structure',
          course: 'graphics',
          feeTypes: [
            { id: '4', name: 'Tuition Fee', amount: 4500, frequency: 'monthly', category: 'tuition' },
            { id: '5', name: 'Software License Fee', amount: 2000, frequency: 'yearly', category: 'other' },
            { id: '6', name: 'Library Fee', amount: 500, frequency: 'yearly', category: 'library' }
          ],
          totalAmount: 6500,
          createdAt: serverTimestamp()
        }
      ];

      for (const structure of sampleFeeStructures) {
        await addDoc(collection(db, COLLECTIONS.FEE_STRUCTURES), structure);
      }
    }

    // Check if payments exist
    const paymentsSnapshot = await getDocs(collection(db, COLLECTIONS.PAYMENTS));
    if (paymentsSnapshot.empty) {
      // Get the first student ID for sample payment
      const studentsSnapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
      if (!studentsSnapshot.empty) {
        const firstStudent = studentsSnapshot.docs[0];
        const samplePayment = {
          studentId: firstStudent.id,
          feeTypeId: '1',
          amount: 5000,
          date: '2024-01-15',
          method: 'online',
          receiptNumber: 'RCP001',
          status: 'completed',
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, COLLECTIONS.PAYMENTS), samplePayment);
      }
    }

    console.log('Default data initialized successfully');
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};

// Utility functions for data operations
export const getStudentsByCourse = async (course: string): Promise<Student[]> => {
  const q = query(
    collection(db, COLLECTIONS.STUDENTS),
    where('course', '==', course),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Student[];
};

export const getPaymentsByStudent = async (studentId: string): Promise<Payment[]> => {
  const q = query(
    collection(db, COLLECTIONS.PAYMENTS),
    where('studentId', '==', studentId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Payment[];
};

export const getFeeStructureByCourse = async (course: string): Promise<FeeStructure | null> => {
  const q = query(
    collection(db, COLLECTIONS.FEE_STRUCTURES),
    where('course', '==', course),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as FeeStructure;
};

export const getRecentPayments = async (limitCount: number = 10): Promise<Payment[]> => {
  const q = query(
    collection(db, COLLECTIONS.PAYMENTS),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Payment[];
};

export const getPaymentStats = async () => {
  const paymentsSnapshot = await getDocs(collection(db, COLLECTIONS.PAYMENTS));
  const payments = paymentsSnapshot.docs.map(doc => doc.data()) as Payment[];
  
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  
  return {
    totalRevenue,
    pendingPayments,
    completedPayments,
    totalPayments: payments.length
  };
};
