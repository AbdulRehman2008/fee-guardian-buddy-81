import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/AuthContainer';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import StudentManagement from '@/components/StudentManagement';
import PaymentManagement from '@/components/PaymentManagement';
import PassoutStudents from '@/components/PassoutStudents';

const Index = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show loading spinner while Firebase auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only allow admin users to access the system
  if (!isAuthenticated || !isAdmin) {
    return <AuthContainer />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement onNavigateToPassout={() => setCurrentPage('passout-students')} />;
      case 'payments':
        return <PaymentManagement />;
      case 'passout-students':
        return <PassoutStudents onBack={() => setCurrentPage('students')} />;
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
