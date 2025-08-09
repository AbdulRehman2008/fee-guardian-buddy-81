import React from 'react';
import { useFee } from '@/contexts/FeeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { students, payments, feeStructures, getStudentDues } = useFee();

  // Calculate statistics
  const totalStudents = students.length;
  const totalCollected = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalDues = students.reduce((sum, student) => sum + getStudentDues(student.id), 0);
  
  const recentPayments = payments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const overdueStudents = students.filter(student => getStudentDues(student.id) > 0);

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents.toString(),
      icon: Users,
      color: 'bg-primary',
      change: '+12%'
    },
    {
      title: 'Fees Collected',
      value: `₹${totalCollected.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-success',
      change: '+8%'
    },
    {
      title: 'Outstanding Dues',
      value: `₹${totalDues.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-warning',
      change: '-3%'
    },
    {
      title: 'Collection Rate',
      value: `${totalCollected > 0 ? Math.round((totalCollected / (totalCollected + totalDues)) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'bg-accent',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your school's fee management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-success mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{student?.name}</p>
                      <p className="text-sm text-muted-foreground">{payment.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{payment.amount.toLocaleString()}</p>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students with Dues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-warning" />
              Students with Outstanding Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueStudents.slice(0, 5).map((student) => {
                const dues = getStudentDues(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Course: {student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-warning">₹{dues.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                    </div>
                  </div>
                );
              })}
              {overdueStudents.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No outstanding dues! 🎉</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;