import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2, Phone, Lock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserType } from '@/types';
import { cn } from '@/lib/utils';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setUserType, setIsAuthenticated } = useUser();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<UserType>('individual');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(phone, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUserType(user.is_business ? 'business' : 'individual');
      setIsAuthenticated(true);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.error || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/logo.ico" alt="MulaSense Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold">MulaSense</h1>
          <p className="text-muted-foreground mt-2">Your Money, Smarter</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedType('individual')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    selectedType === 'individual'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <User className={cn(
                    "w-8 h-8 mx-auto mb-2",
                    selectedType === 'individual' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <p className="font-medium text-sm">Individual</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('business')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    selectedType === 'business'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Building2 className={cn(
                    "w-8 h-8 mx-auto mb-2",
                    selectedType === 'business' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <p className="font-medium text-sm">Business</p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+263 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12" variant="gradient" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
