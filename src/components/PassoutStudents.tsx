import React, { useState } from 'react';
import { useFee } from '@/contexts/FeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

interface PassoutStudentsProps {
  onBack: () => void;
}

const PassoutStudents: React.FC<PassoutStudentsProps> = ({ onBack }) => {
  const { students } = useFee();
  const [searchTerm, setSearchTerm] = useState('');

  // For now, we'll simulate passout students by filtering students from previous years
  // In a real app, you'd have a separate passout students collection
  const currentYear = new Date().getFullYear();
  const passoutStudents = students.filter(student => {
    const admissionYear = new Date(student.admissionDate).getFullYear();
    return currentYear - admissionYear >= 4; // Assuming 4-year graduation
  });

  const filteredPassoutStudents = passoutStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.includes(searchTerm)
  );

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
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <GraduationCap className="h-4 w-4 mr-2" />
          {passoutStudents.length} Graduates
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search passout students by name, roll number, or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Passout Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPassoutStudents.map((student) => {
          const admissionYear = new Date(student.admissionDate).getFullYear();
          const graduationYear = admissionYear + 4; // Assuming 4-year course
          
          return (
            <Card key={student.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Roll: {student.rollNumber}
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
                    <span>Admitted: {new Date(student.admissionDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 rounded border border-primary/20">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">
                      Class: {student.class}-{student.section}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Graduation Year: {graduationYear}
                    </p>
                  </div>
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