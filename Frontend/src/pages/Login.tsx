import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Phone, Wrench, UserCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'client' as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isLogin) {
    const success = await login(formData.email, formData.password);
    if (success) {
      toast({
        title: "Login Successful!",
        description: "Welcome back to Mistri Ghar Tak",
      });

      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'mistri') navigate('/mistri-dashboard');
        else if (user.role === 'client') navigate('/gigs');
        else if (user.role === 'admin') navigate('/admin');
        else navigate('/');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  } else {
    const success = await signup(
      formData.email,
      formData.password,
      formData.name,
      formData.role,
      formData.phone
    );

    if (success) {
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully",
      });
      if (formData.role === 'mistri') navigate('/mistri-dashboard');
      else if (formData.role === 'client') navigate('/gigs');
      else navigate('/');
    } else {
      toast({
        title: "Signup Failed",
        description: "Email already exists or invalid data",
        variant: "destructive",
      });
    }
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? 'Login to your account' : 'Join Mistri Ghar Tak today'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'client' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'client'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <UserCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-semibold">Client</p>
                      <p className="text-xs text-muted-foreground">Hire Mistris</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'mistri' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === 'mistri'
                          ? 'border-secondary bg-secondary/5'
                          : 'border-gray-200 hover:border-secondary/50'
                      }`}
                    >
                      <Wrench className="w-8 h-8 mx-auto mb-2 text-secondary" />
                      <p className="font-semibold">Mistri</p>
                      <p className="text-xs text-muted-foreground">Offer Services</p>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
