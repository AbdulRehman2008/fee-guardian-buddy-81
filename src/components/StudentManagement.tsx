import React, { useState } from 'react';
import { useFee, Student } from '@/contexts/FeeContext';
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
  Edit, 
  Trash2, 
  User,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentManagementProps {
  onNavigateToPassout?: () => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ onNavigateToPassout }) => {
  const { students, addStudent, updateStudent, deleteStudent, getStudentDues, addPayment } = useFee();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    course: '',
    parentName: '',
    parentContact: '',
    email: '',
    admissionDate: '',
    feeAmount: ''
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.whatsappNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      whatsappNumber: '',
      course: '',
      parentName: '',
      parentContact: '',
      email: '',
      admissionDate: '',
      feeAmount: ''
    });
    setEditingStudent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
        course: formData.course,
        parentName: formData.parentName,
        parentContact: formData.parentContact,
        email: formData.email,
        admissionDate: formData.admissionDate
      });
      toast({
        title: "Student Updated",
        description: "Student information has been updated successfully.",
      });
    } else {
      const newStudentId = addStudent({
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
        course: formData.course,
        parentName: formData.parentName,
        parentContact: formData.parentContact,
        email: formData.email,
        admissionDate: formData.admissionDate
      });
      
      // If fee amount is provided, create a payment record
      if (formData.feeAmount && parseFloat(formData.feeAmount) > 0) {
        addPayment({
          studentId: newStudentId,
          feeTypeId: 'general-fee',
          amount: parseFloat(formData.feeAmount),
          date: new Date().toISOString().split('T')[0],
          method: 'cash',
          status: 'completed'
        });
      }
      
      toast({
        title: "Student Added",
        description: "New student has been added successfully.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      whatsappNumber: student.whatsappNumber,
      course: student.course,
      parentName: student.parentName,
      parentContact: student.parentContact,
      email: student.email,
      admissionDate: student.admissionDate,
      feeAmount: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (studentId: string) => {
    deleteStudent(studentId);
    toast({
      title: "Student Deleted",
      description: "Student has been removed from the system.",
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">Student Management</h2>
          <p className="text-sm lg:text-base text-muted-foreground">Manage student profiles and information</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" onClick={onNavigateToPassout} className="w-full sm:w-auto">
            <User className="h-4 w-4 mr-2" />
            Passout Students
          </Button>
          
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4 w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="graphics">Graphics Design</SelectItem>
                    <SelectItem value="wsoffice">MS Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName">Parent/Guardian Name</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentContact">Parent Contact</Label>
                <Input
                  id="parentContact"
                  value={formData.parentContact}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  required
                />
              </div>

              {!editingStudent && (
                <div className="space-y-2">
                  <Label htmlFor="feeAmount">Fee Amount (Optional)</Label>
                  <Input
                    id="feeAmount"
                    type="number"
                    value={formData.feeAmount}
                    onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                    placeholder="Enter fee amount"
                  />
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingStudent ? 'Update' : 'Add'} Student
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
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, WhatsApp number, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredStudents.map((student) => {
          const dues = getStudentDues(student.id);
          return (
            <Card key={student.id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp: {student.whatsappNumber}
                    </p>
                  </div>
                  <Badge variant={dues > 0 ? "destructive" : "default"}>
                    {student.course === 'web' ? 'Web Dev' : student.course === 'graphics' ? 'Graphics' : 'MS Office'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.parentName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.parentContact}</span>
                  </div>
                  {student.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{student.email}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{new Date(student.admissionDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {dues > 0 && (
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">
                      Outstanding: Rs{dues.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(student)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(student.id)}
                    className="text-destructive hover:text-destructive sm:w-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first student'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentManagement;