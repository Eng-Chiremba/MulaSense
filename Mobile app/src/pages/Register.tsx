import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { UserType } from '@/types';
import { cn } from '@/lib/utils';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<UserType>('individual');
  const [loading, setLoading] = useState(false);

  const [individualData, setIndividualData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessPhone: '',
    businessEmail: '',
    businessAddress: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = selectedType === 'individual' ? individualData : businessData;
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const payload = selectedType === 'individual' 
        ? {
            name: individualData.fullName,
            phone: individualData.phone,
            email: individualData.email || undefined,
            password: individualData.password,
            is_business: false,
          }
        : {
            business_name: businessData.businessName,
            business_phone: businessData.businessPhone,
            email: businessData.businessEmail,
            business_address: businessData.businessAddress,
            password: businessData.password,
            is_business: true,
          };

      await authAPI.register(payload);
      
      toast({
        title: 'Registration successful',
        description: 'Please login to continue',
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'Please try again',
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
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join MulaSense today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
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

            {selectedType === 'individual' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={individualData.fullName}
                      onChange={(e) => setIndividualData({ ...individualData, fullName: e.target.value })}
                      className="pl-10"
                      required
                    />
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
                      value={individualData.phone}
                      onChange={(e) => setIndividualData({ ...individualData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={individualData.email}
                      onChange={(e) => setIndividualData({ ...individualData, email: e.target.value })}
                      className="pl-10"
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
                      value={individualData.password}
                      onChange={(e) => setIndividualData({ ...individualData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={individualData.confirmPassword}
                      onChange={(e) => setIndividualData({ ...individualData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      placeholder="TechStart Solutions"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Line</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder="+263 77 987 6543"
                      value={businessData.businessPhone}
                      onChange={(e) => setBusinessData({ ...businessData, businessPhone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessEmail"
                      type="email"
                      placeholder="info@techstart.com"
                      value={businessData.businessEmail}
                      onChange={(e) => setBusinessData({ ...businessData, businessEmail: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessAddress"
                      placeholder="123 Innovation Street, Harare"
                      value={businessData.businessAddress}
                      onChange={(e) => setBusinessData({ ...businessData, businessAddress: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPassword">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessPassword"
                      type="password"
                      placeholder="••••••••"
                      value={businessData.password}
                      onChange={(e) => setBusinessData({ ...businessData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessConfirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={businessData.confirmPassword}
                      onChange={(e) => setBusinessData({ ...businessData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <Button type="submit" className="w-full h-12" variant="gradient" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-medium hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
