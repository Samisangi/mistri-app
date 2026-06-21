import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (passwords.newPassword.length < 4) {
      toast({ title: "Error", description: "Password must be at least 4 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: passwords.newPassword
      });
      setSuccess(true);
      toast({ title: "Password Reset!", description: "You can now login with your new password" });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid or expired reset link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <p className="text-muted-foreground">Enter your new password</p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Password Reset Successful!</h3>
              <p className="text-muted-foreground">Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-10"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-10"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;