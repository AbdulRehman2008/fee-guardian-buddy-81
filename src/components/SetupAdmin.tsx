import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { setupInitialAdmin } from '@/lib/setupAdmin';
import { useToast } from '@/hooks/use-toast';

interface SetupAdminProps {
  onBack: () => void;
}

const SetupAdmin: React.FC<SetupAdminProps> = ({ onBack }) => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetupAdmin = async () => {
    setIsSettingUp(true);
    setError(null);
    
    try {
      const result = await setupInitialAdmin();
      
      if (result.success) {
        setIsComplete(true);
        toast({
          title: "Setup Complete!",
          description: "Administrator account created successfully. You can now log in.",
        });
      } else {
        setError(result.error || 'Failed to create administrator account');
        toast({
          title: "Setup Failed",
          description: result.error || 'Failed to create administrator account',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Setup Error",
        description: err.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Setup Complete!</CardTitle>
            <CardDescription>
              Your administrator account has been created successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">Administrator Account Ready</h3>
              </div>
              <p className="text-sm text-green-700 mt-2">
                The system administrator account has been created and is ready to use.
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>You can now use the administrator credentials to log in to the system.</p>
              <p className="mt-2">All data will be securely stored in Firebase and accessible from any device.</p>
              <p className="mt-2 font-medium">Contact the system administrator for login credentials.</p>
            </div>
            
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Setup Administrator Account</CardTitle>
          <CardDescription>
            Create the initial administrator account for EduFee Manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">This will create:</p>
                <ul className="mt-1 space-y-1">
                  <li>• A new administrator account</li>
                  <li>• Full system access privileges</li>
                  <li>• Secure authentication setup</li>
                  <li>• System initialization</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSetupAdmin} 
            disabled={isSettingUp}
            className="w-full"
          >
            {isSettingUp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up administrator account...
              </>
            ) : (
              'Create Administrator Account'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>This setup only needs to be run once.</p>
            <p>After setup, contact the system administrator for login credentials.</p>
          </div>

          <div className="text-center">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onBack}
              className="text-sm"
            >
              ← Back to Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
