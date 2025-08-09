import React, { useState } from 'react';
import { useFee, PassoutStudent } from '@/contexts/FeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  ArrowLeft,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PassoutStudentsProps {
  onBack: () => void;
}

const PassoutStudents: React.FC<PassoutStudentsProps> = ({ onBack }) => {
  const { passoutStudents, addPassoutStudent, updatePassoutStudent, deletePassoutStudent } = useFee();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<PassoutStudent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    course: '',
    parentName: '',
    parentContact: '',
    email: '',
    graduationDate: '',
    finalGrade: '',
    achievements: ''
  });

  const filteredPassoutStudents = passoutStudents.filter(student =>
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
      graduationDate: '',
      finalGrade: '',
      achievements: ''
    });
    setEditingStudent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      updatePassoutStudent(editingStudent.id, formData);
      toast({
        title: "Student Updated",
        description: "Passout student information has been updated successfully.",
      });
    } else {
      addPassoutStudent(formData);
      toast({
        title: "Student Added",
        description: "New passout student has been added successfully.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (student: PassoutStudent) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      whatsappNumber: student.whatsappNumber,
      course: student.course,
      parentName: student.parentName,
      parentContact: student.parentContact,
      email: student.email,
      graduationDate: student.graduationDate,
      finalGrade: student.finalGrade || '',
      achievements: student.achievements || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (studentId: string) => {
    deletePassoutStudent(studentId);
    toast({
      title: "Student Deleted",
      description: "Passout student has been removed from the system.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Passout Students</h2>
            <p className="text-muted-foreground">View details of graduated students</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            {passoutStudents.length} Graduates
          </Badge>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Passout Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Passout Student' : 'Add New Passout Student'}
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
                  <Label htmlFor="graduationDate">Graduation Date</Label>
                  <Input
                    id="graduationDate"
                    type="date"
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalGrade">Final Grade</Label>
                  <Input
                    id="finalGrade"
                    value={formData.finalGrade}
                    onChange={(e) => setFormData({ ...formData, finalGrade: e.target.value })}
                    placeholder="e.g., A+, First Class, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="Academic achievements, awards, etc."
                    rows={3}
                  />
                </div>

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
          placeholder="Search passout students by name, WhatsApp number, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Passout Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPassoutStudents.map((student) => {
          return (
            <Card key={student.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp: {student.whatsappNumber}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Graduate
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
                    <span>Graduated: {new Date(student.graduationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 rounded border border-primary/20">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">
                      Course: {student.course === 'web' ? 'Web Development' : student.course === 'graphics' ? 'Graphics Design' : 'MS Office'}
                    </p>
                    {student.finalGrade && (
                      <p className="text-xs text-muted-foreground">
                        Final Grade: {student.finalGrade}
                      </p>
                    )}
                  </div>
                </div>

                {student.achievements && (
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Achievements:</p>
                    <p className="text-sm">{student.achievements}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
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
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPassoutStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No passout students found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria' : 'No students have graduated yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PassoutStudents;