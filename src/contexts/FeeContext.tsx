import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  parentContact: string;
  email: string;
  admissionDate: string;
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
  class: string;
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
  feeStructures: FeeStructure[];
  payments: Payment[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => void;
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
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      rollNumber: '2024001',
      class: '10',
      section: 'A',
      parentName: 'Robert Doe',
      parentContact: '+1234567890',
      email: 'john.doe@email.com',
      admissionDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      rollNumber: '2024002',
      class: '10',
      section: 'B',
      parentName: 'Michael Smith',
      parentContact: '+1234567891',
      email: 'jane.smith@email.com',
      admissionDate: '2024-01-16'
    }
  ]);

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([
    {
      id: '1',
      name: 'Class 10 Fee Structure',
      class: '10',
      feeTypes: [
        { id: '1', name: 'Tuition Fee', amount: 5000, frequency: 'monthly', category: 'tuition' },
        { id: '2', name: 'Transport Fee', amount: 1500, frequency: 'monthly', category: 'transport' },
        { id: '3', name: 'Library Fee', amount: 500, frequency: 'yearly', category: 'library' }
      ],
      totalAmount: 7000
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      studentId: '1',
      feeTypeId: '1',
      amount: 5000,
      date: '2024-01-15',
      method: 'online',
      receiptNumber: 'RCP001',
      status: 'completed'
    }
  ]);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addFeeStructure = (structureData: Omit<FeeStructure, 'id'>) => {
    const newStructure: FeeStructure = {
      ...structureData,
      id: Date.now().toString()
    };
    setFeeStructures(prev => [...prev, newStructure]);
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
      receiptNumber: `RCP${Date.now().toString().slice(-6)}`
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const getStudentDues = (studentId: string): number => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;

    const structure = feeStructures.find(fs => fs.class === student.class);
    if (!structure) return 0;

    const studentPayments = payments.filter(p => p.studentId === studentId && p.status === 'completed');
    const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return structure.totalAmount - totalPaid;
  };

  return (
    <FeeContext.Provider value={{
      students,
      feeStructures,
      payments,
      addStudent,
      updateStudent,
      deleteStudent,
      addFeeStructure,
      addPayment,
      getStudentDues
    }}>
      {children}
    </FeeContext.Provider>
  );
};