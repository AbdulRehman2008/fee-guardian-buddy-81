import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import StudentManagement from '@/components/StudentManagement';
import FeeStructureManagement from '@/components/FeeStructureManagement';
import PaymentManagement from '@/components/PaymentManagement';
import PassoutStudents from '@/components/PassoutStudents';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement onNavigateToPassout={() => setCurrentPage('passout-students')} />;
      case 'fees':
        return <FeeStructureManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'passout-students':
        return <PassoutStudents onBack={() => setCurrentPage('students')} />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings page coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
