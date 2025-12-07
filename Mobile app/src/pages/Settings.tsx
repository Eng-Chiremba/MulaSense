import { 
  Bell, Moon, Globe, Lock, HelpCircle, FileText, 
  ChevronRight, LogOut, Smartphone
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

const settingsSections = [
  {
    title: 'Preferences',
    items: [
      { 
        icon: Bell, 
        label: 'Push Notifications', 
        description: 'Receive alerts and updates',
        hasToggle: true,
        value: true
      },
      { 
        icon: Moon, 
        label: 'Dark Mode', 
        description: 'Switch to dark theme',
        hasToggle: true,
        value: false
      },
      { 
        icon: Globe, 
        label: 'Language', 
        description: 'English (US)',
        hasArrow: true
      },
      { 
        icon: Smartphone, 
        label: 'Currency', 
        description: 'USD ($)',
        hasArrow: true
      },
    ],
  },
  {
    title: 'Security',
    items: [
      { 
        icon: Lock, 
        label: 'Biometric Login', 
        description: 'Use fingerprint or face ID',
        hasToggle: true,
        value: true
      },
      { 
        icon: Lock, 
        label: 'Change Password', 
        description: 'Update your password',
        hasArrow: true
      },
    ],
  },
  {
    title: 'Support',
    items: [
      { 
        icon: HelpCircle, 
        label: 'Help Center', 
        description: 'Get help and FAQs',
        hasArrow: true
      },
      { 
        icon: FileText, 
        label: 'Terms of Service', 
        description: 'Read our terms',
        hasArrow: true
      },
      { 
        icon: FileText, 
        label: 'Privacy Policy', 
        description: 'How we handle your data',
        hasArrow: true
      },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUser();

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

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your app experience</p>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, idx) => (
        <div 
          key={section.title} 
          className={`space-y-3 animate-fade-up stagger-${idx + 1}`}
        >
          <h3 className="font-semibold text-sm text-muted-foreground px-1">
            {section.title}
          </h3>
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
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.hasToggle && (
                  <Switch defaultChecked={item.value} />
                )}
                {item.hasArrow && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="animate-fade-up stagger-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Log Out</p>
            <p className="text-xs opacity-80">Sign out of your account</p>
          </div>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-muted-foreground animate-fade-up stagger-5">
        <p>MulaSense v1.0.0</p>
        <p className="mt-1">© 2024 MulaSense. All rights reserved.</p>
      </div>
    </div>
  );
}
