import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, Building2, MapPin, 
  Wallet, Camera, ChevronRight, Shield, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockUser } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/login');
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { icon: User, label: 'Full Name', value: user.name || 'Not set' },
        { icon: Mail, label: 'Email', value: user.email || 'Not set' },
        { icon: Phone, label: 'Phone', value: user.phone || 'Not set' },
      ],
    },
    {
      title: 'Account Type',
      items: [
        { icon: user.is_business ? Building2 : User, label: 'Account Type', value: user.is_business ? 'Business' : 'Individual' },
      ],
    },
  ];
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center animate-fade-up">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-xl font-bold mt-4">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
            {user.is_business ? 'Business' : 'Individual'}
          </span>
        </div>
      </div>

      {/* Account Status */}
      <div className="p-4 rounded-2xl bg-success/10 border border-success/20 animate-fade-up stagger-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-semibold text-sm">Account Verified</p>
            <p className="text-xs text-muted-foreground">Your account is secure and verified</p>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      {profileSections.map((section, idx) => (
        <div 
          key={section.title} 
          className={`space-y-3 animate-fade-up stagger-${idx + 2}`}
        >
          <h3 className="font-semibold text-sm text-muted-foreground">{section.title}</h3>
          <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="space-y-3 animate-fade-up stagger-4">
        <Button variant="outline" className="w-full justify-start h-12">
          <Shield className="w-5 h-5 mr-3" />
          Change Password
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
        <Button variant="destructive" className="w-full justify-start h-12">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
