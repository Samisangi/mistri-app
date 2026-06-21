import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast({ title: "Email Sent!", description: "Check your inbox for the reset link" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset email",
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
          <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
          <p className="text-muted-foreground">
            Enter your email and we'll send you a reset link
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Check Your Email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>. 
                The link will expire in 30 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;