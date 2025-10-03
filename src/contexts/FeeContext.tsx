import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Student {
  id: string;
  name: string;
  whatsappNumber: string;
  course: string;
  parentName: string;
  parentContact: string;
  email: string;
  admissionDate: string;
}

export interface PassoutStudent {
  id: string;
  name: string;
  whatsappNumber: string;
  course: string;
  parentName: string;
  parentContact: string;
  email: string;
  graduationDate: string;
  finalGrade?: string;
  achievements?: string;
}

export interface FeeType {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  category: 'tuition' | 'transport' | 'library' | 'sports' | 'other';
}

export interface FeeStructure {
  id: string;
  name: string;
  course: string;
  feeTypes: FeeType[];
  totalAmount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  feeTypeId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'online' | 'check';
  receiptNumber: string;
  status: 'completed' | 'pending' | 'failed';
}

interface FeeContextType {
  students: Student[];
  passoutStudents: PassoutStudent[];
  feeStructures: FeeStructure[];
  payments: Payment[];
  loading: boolean;
  addStudent: (student: Omit<Student, 'id'>) => Promise<string>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addPassoutStudent: (student: Omit<PassoutStudent, 'id'>) => Promise<void>;
  updatePassoutStudent: (id: string, student: Partial<PassoutStudent>) => Promise<void>;
  deletePassoutStudent: (id: string) => Promise<void>;
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => Promise<void>;
  updateFeeStructure: (id: string, structure: Partial<FeeStructure>) => Promise<void>;
  deleteFeeStructure: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => Promise<void>;
  getStudentDues: (studentId: string) => number;
}

const FeeContext = createContext<FeeContextType | undefined>(undefined);

export const useFee = () => {
  const context = useContext(FeeContext);
  if (context === undefined) {
    throw new Error('useFee must be used within a FeeProvider');
  }
  return context;
};

interface FeeProviderProps {
  children: ReactNode;
}

export const FeeProvider: React.FC<FeeProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [passoutStudents, setPassoutStudents] = useState<PassoutStudent[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Set up real-time listeners for Firestore collections
  useEffect(() => {
    const unsubscribeStudents = onSnapshot(
      query(collection(db, 'students'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Student[];
        setStudents(studentsData);
      }
    );

    const unsubscribePassoutStudents = onSnapshot(
      query(collection(db, 'passoutStudents'), orderBy('graduationDate', 'desc')),
      (snapshot) => {
        const passoutData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PassoutStudent[];
        setPassoutStudents(passoutData);
      }
    );

    const unsubscribeFeeStructures = onSnapshot(
      collection(db, 'feeStructures'),
      (snapshot) => {
        const structuresData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FeeStructure[];
        setFeeStructures(structuresData);
      }
    );

    const unsubscribePayments = onSnapshot(
      query(collection(db, 'payments'), orderBy('date', 'desc')),
      (snapshot) => {
        const paymentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        setPayments(paymentsData);
      }
    );

    setLoading(false);

    // Cleanup listeners on unmount
    return () => {
      unsubscribeStudents();
      unsubscribePassoutStudents();
      unsubscribeFeeStructures();
      unsubscribePayments();
    };
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...studentData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'students', id), {
        ...studentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  const addPassoutStudent = async (studentData: Omit<PassoutStudent, 'id'>): Promise<void> => {
    try {
      await addDoc(collection(db, 'passoutStudents'), {
        ...studentData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding passout student:', error);
      throw error;
    }
  };

  const updatePassoutStudent = async (id: string, studentData: Partial<PassoutStudent>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'passoutStudents', id), {
        ...studentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating passout student:', error);
      throw error;
    }
  };

  const deletePassoutStudent = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'passoutStudents', id));
    } catch (error) {
      console.error('Error deleting passout student:', error);
      throw error;
    }
  };

  const addFeeStructure = async (structureData: Omit<FeeStructure, 'id'>): Promise<void> => {
    try {
      await addDoc(collection(db, 'feeStructures'), {
        ...structureData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding fee structure:', error);
      throw error;
    }
  };

  const updateFeeStructure = async (id: string, structureData: Partial<FeeStructure>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'feeStructures', id), {
        ...structureData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating fee structure:', error);
      throw error;
    }
  };

  const deleteFeeStructure = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'feeStructures', id));
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      throw error;
    }
  };

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'receiptNumber'>): Promise<void> => {
    try {
      const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, 'payments'), {
        ...paymentData,
        receiptNumber,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  };

  const getStudentDues = (studentId: string): number => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;

    const structure = feeStructures.find(fs => fs.course === student.course);
    if (!structure) return 0;

    const studentPayments = payments.filter(p => p.studentId === studentId && p.status === 'completed');
    const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return structure.totalAmount - totalPaid;
  };

  return (
    <FeeContext.Provider value={{
      students,
      passoutStudents,
      feeStructures,
      payments,
      loading,
      addStudent,
      updateStudent,
      deleteStudent,
      addPassoutStudent,
      updatePassoutStudent,
      deletePassoutStudent,
      addFeeStructure,
      updateFeeStructure,
      deleteFeeStructure,
      addPayment,
      getStudentDues
    }}>
      {children}
    </FeeContext.Provider>
  );
};