import React, { useState } from 'react';
import { useFee, FeeStructure, FeeType } from '@/contexts/FeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  BookOpen,
  Bus,
  Dumbbell,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeeStructureManagement: React.FC = () => {
  const { feeStructures, addFeeStructure } = useFee();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    feeTypes: [] as FeeType[]
  });
  const [currentFeeType, setCurrentFeeType] = useState({
    name: '',
    amount: '',
    frequency: '' as 'monthly' | 'quarterly' | 'yearly' | 'one-time' | '',
    category: '' as 'tuition' | 'transport' | 'library' | 'sports' | 'other' | ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      feeTypes: []
    });
    setCurrentFeeType({
      name: '',
      amount: '',
      frequency: '',
      category: ''
    });
  };

  const addFeeType = () => {
    if (!currentFeeType.name || !currentFeeType.amount || !currentFeeType.frequency || !currentFeeType.category) {
      toast({
        title: "Error",
        description: "Please fill in all fee type fields.",
        variant: "destructive",
      });
      return;
    }

    const newFeeType: FeeType = {
      id: Date.now().toString(),
      name: currentFeeType.name,
      amount: parseFloat(currentFeeType.amount),
      frequency: currentFeeType.frequency,
      category: currentFeeType.category
    };

    setFormData(prev => ({
      ...prev,
      feeTypes: [...prev.feeTypes, newFeeType]
    }));

    setCurrentFeeType({
      name: '',
      amount: '',
      frequency: '',
      category: ''
    });
  };

  const removeFeeType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      feeTypes: prev.feeTypes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.class || formData.feeTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one fee type.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = formData.feeTypes.reduce((sum, feeType) => sum + feeType.amount, 0);

    addFeeStructure({
      name: formData.name,
      class: formData.class,
      feeTypes: formData.feeTypes,
      totalAmount
    });

    toast({
      title: "Fee Structure Added",
      description: "New fee structure has been created successfully.",
    });
    
    resetForm();
    setIsDialogOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tuition':
        return BookOpen;
      case 'transport':
        return Bus;
      case 'sports':
        return Dumbbell;
      default:
        return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tuition':
        return 'bg-primary text-primary-foreground';
      case 'transport':
        return 'bg-warning text-warning-foreground';
      case 'library':
        return 'bg-accent text-accent-foreground';
      case 'sports':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fee Structure Management</h2>
          <p className="text-muted-foreground">Define and manage fee structures for different classes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Fee Structure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Fee Structure</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Structure Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Class 10 Fee Structure"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    placeholder="e.g., 10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Fee Types</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feeTypeName">Fee Type Name</Label>
                    <Input
                      id="feeTypeName"
                      value={currentFeeType.name}
                      onChange={(e) => setCurrentFeeType({ ...currentFeeType, name: e.target.value })}
                      placeholder="e.g., Tuition Fee"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={currentFeeType.amount}
                      onChange={(e) => setCurrentFeeType({ ...currentFeeType, amount: e.target.value })}
                      placeholder="e.g., 5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={currentFeeType.frequency} onValueChange={(value: any) => setCurrentFeeType({ ...currentFeeType, frequency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={currentFeeType.category} onValueChange={(value: any) => setCurrentFeeType({ ...currentFeeType, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Tuition</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="button" onClick={addFeeType} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee Type
                </Button>

                {/* Added Fee Types */}
                {formData.feeTypes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Added Fee Types:</h4>
                    {formData.feeTypes.map((feeType, index) => {
                      const IconComponent = getCategoryIcon(feeType.category);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded ${getCategoryColor(feeType.category)}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{feeType.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ₹{feeType.amount.toLocaleString()} • {feeType.frequency}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeFeeType(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                    
                    <div className="text-right p-3 bg-primary/10 rounded-lg">
                      <p className="text-lg font-semibold text-primary">
                        Total: ₹{formData.feeTypes.reduce((sum, ft) => sum + ft.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Fee Structure
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

      {/* Fee Structures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {feeStructures.map((structure) => (
          <Card key={structure.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{structure.name}</span>
                <Badge variant="outline">Class {structure.class}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {structure.feeTypes.map((feeType) => {
                  const IconComponent = getCategoryIcon(feeType.category);
                  return (
                    <div key={feeType.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getCategoryColor(feeType.category)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{feeType.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {feeType.frequency} • {feeType.category}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">₹{feeType.amount.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{structure.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {feeStructures.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No fee structures found</h3>
            <p className="text-muted-foreground">
              Start by creating your first fee structure for a class
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeeStructureManagement;