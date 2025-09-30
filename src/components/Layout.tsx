import React, { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Menu, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();

  // If user is not admin, they shouldn't be here
  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/20">
        <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden bg-card border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="p-2">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary rounded-lg">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">EduFee Manager</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground truncate max-w-20">{user?.name}</p>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">Admin</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:block bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="p-2">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div>
                  <h1 className="text-xl font-bold text-foreground">EduFee Manager</h1>
                  <p className="text-sm text-muted-foreground">School Fee Management System</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">Administrator</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;