import React, { useState } from 'react';
import { useFee, Payment } from '@/contexts/FeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download, 
  CreditCard,
  Calendar,
  User,
  Receipt,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentManagement: React.FC = () => {
  const { students, payments, feeStructures, addPayment } = useFee();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    feeTypeId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: '' as 'cash' | 'card' | 'online' | 'check' | ''
  });

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.studentId);
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const resetForm = () => {
    setFormData({
      studentId: '',
      feeTypeId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.feeTypeId || !formData.amount || !formData.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addPayment({
      studentId: formData.studentId,
      feeTypeId: formData.feeTypeId,
      amount: parseFloat(formData.amount),
      date: formData.date,
      method: formData.method,
      status: 'completed'
    });

    toast({
      title: "Payment Recorded",
      description: "Payment has been successfully recorded.",
    });
    
    resetForm();
    setIsDialogOpen(false);
  };

  const getStudentCourse = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? (student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office') : '';
  };

  const getFeeTypeName = (feeTypeId: string) => {
    for (const structure of feeStructures) {
      const feeType = structure.feeTypes.find(ft => ft.id === feeTypeId);
      if (feeType) return feeType.name;
    }
    return 'Unknown Fee';
  };

  const getAvailableFeeTypes = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];

    const structure = feeStructures.find(fs => fs.course === student.course);
    return structure ? structure.feeTypes : [];
  };

  const generateReceipt = (payment: Payment) => {
    const student = students.find(s => s.id === payment.studentId);
    const feeTypeName = getFeeTypeName(payment.feeTypeId);
    
    const receiptContent = `
      SCHOOL FEE RECEIPT
      Receipt No: ${payment.receiptNumber}
      Date: ${new Date(payment.date).toLocaleDateString()}
      
      Student: ${student?.name}
      Course: ${getStudentCourse(payment.studentId)}
      
      Fee Type: ${feeTypeName}
      Amount: ₹${payment.amount.toLocaleString()}
      Payment Method: ${payment.method.toUpperCase()}
      
      Status: ${payment.status.toUpperCase()}
    `;
    
    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${payment.receiptNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateStudentInvoice = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      toast({
        title: "Error",
        description: "Student not found.",
        variant: "destructive",
      });
      return;
    }

    const studentPayments = payments.filter(p => p.studentId === studentId && p.status === 'completed');
    const structure = feeStructures.find(fs => fs.course === student.course);
    
    // Group payments by month and year
    const paymentsByMonth = studentPayments.reduce((acc, payment) => {
      const date = new Date(payment.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(payment);
      return acc;
    }, {} as Record<string, Payment[]>);

    const sortedMonths = Object.keys(paymentsByMonth).sort();
    
    let invoiceContent = `
      STUDENT PAYMENT INVOICE
      Generated on: ${new Date().toLocaleDateString()}
      
      Student Details:
      Name: ${student.name}
      WhatsApp Number: ${student.whatsappNumber}
      Course: ${student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}
      Parent: ${student.parentName}
      Contact: ${student.parentContact}
      Email: ${student.email}
      Admission Date: ${new Date(student.admissionDate).toLocaleDateString()}
      
      Fee Structure (${student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}):`;
      
    if (structure) {
      invoiceContent += `\n      Structure: ${structure.name}`;
      structure.feeTypes.forEach(feeType => {
        invoiceContent += `\n      ${feeType.name}: ₹${feeType.amount.toLocaleString()} (${feeType.frequency})`;
      });
      invoiceContent += `\n      Total Monthly Fee: ₹${structure.totalAmount.toLocaleString()}`;
    }
    
    invoiceContent += `\n      
      PAYMENT HISTORY
      ===============`;

    let totalPaid = 0;
    
    if (sortedMonths.length === 0) {
      invoiceContent += `\n      
      No payments recorded yet.
      
      Outstanding Amount: ₹${structure ? structure.totalAmount.toLocaleString() : '0'}`;
    } else {
      sortedMonths.forEach(monthYear => {
        const [year, month] = monthYear.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
        
        invoiceContent += `\n\n      ${monthName.toUpperCase()}\n      ${'-'.repeat(monthName.length + 10)}\n`;
        
        let monthTotal = 0;
        paymentsByMonth[monthYear].forEach(payment => {
          const feeTypeName = getFeeTypeName(payment.feeTypeId);
          invoiceContent += `      ${new Date(payment.date).toLocaleDateString().padEnd(12)} ${feeTypeName.padEnd(20)} ₹${payment.amount.toLocaleString().padStart(10)} ${payment.method.toUpperCase().padEnd(10)} ${payment.receiptNumber}\n`;
          monthTotal += payment.amount;
          totalPaid += payment.amount;
        });
        
        invoiceContent += `      ${' '.repeat(32)} Month Total: ₹${monthTotal.toLocaleString()}\n`;
      });
    }

    const outstandingAmount = structure ? (structure.totalAmount * sortedMonths.length) - totalPaid : 0;

    invoiceContent += `
      
      SUMMARY
      =======
      Total Months with Payments: ${sortedMonths.length}
      Total Amount Paid: ₹${totalPaid.toLocaleString()}
      ${structure ? `Outstanding Amount: ₹${Math.max(0, outstandingAmount).toLocaleString()}` : ''}
      Current Dues: ₹${structure ? Math.max(0, structure.totalAmount - (totalPaid % (structure.totalAmount || 1))).toLocaleString() : '0'}
      
      Note: This invoice shows all payment records for this student.
      ${studentPayments.length === 0 ? 'No payments have been recorded yet.' : ''}
    `;

    const element = document.createElement('a');
    const file = new Blob([invoiceContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${student.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Invoice Generated",
      description: `Payment invoice for ${student.name} has been downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payment Management</h2>
          <p className="text-muted-foreground">Record and track fee payments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value, feeTypeId: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.studentId && (
                <div className="space-y-2">
                  <Label htmlFor="feeType">Fee Type</Label>
                  <Select value={formData.feeTypeId} onValueChange={(value) => {
                    const feeTypes = getAvailableFeeTypes(formData.studentId);
                    const selectedFee = feeTypes.find(ft => ft.id === value);
                    setFormData({ 
                      ...formData, 
                      feeTypeId: value,
                      amount: selectedFee ? selectedFee.amount.toString() : ''
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableFeeTypes(formData.studentId).map((feeType) => (
                        <SelectItem key={feeType.id} value={feeType.id}>
                          {feeType.name} - ₹{feeType.amount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={formData.method} onValueChange={(value: any) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="online">Online Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  Record Payment
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Student Invoices Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Student Monthly Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const studentPayments = payments.filter(p => p.studentId === student.id && p.status === 'completed');
              const monthsPaid = [...new Set(studentPayments.map(p => {
                const date = new Date(p.date);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              }))].length;
              const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

              return (
                <Card key={student.id} className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Course: {student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Months Paid: {monthsPaid}</p>
                      <p>Total Paid: ₹{totalPaid.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateStudentInvoice(student.id)}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payments by student name or receipt number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => {
          const student = students.find(s => s.id === payment.studentId);
          const feeTypeName = getFeeTypeName(payment.feeTypeId);
          
          return (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{student?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Course: {getStudentCourse(payment.studentId)} • {feeTypeName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground capitalize">{payment.method}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateReceipt(payment)}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-1" />
                    {payment.receiptNumber}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by recording your first payment'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentManagement;