import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'payments', label: 'Payments', icon: FileText },
];

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, logout } = useAuth();

  const isCollapsed = state === "collapsed";
  const isActive = (page: string) => currentPage === page;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"}>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">EduFee Manager</h1>
              <p className="text-xs text-muted-foreground">School Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.id)}
                    isActive={isActive(item.id)}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          size={isCollapsed ? "icon" : "sm"} 
          onClick={logout}
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}