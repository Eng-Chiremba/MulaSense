import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  FileBarChart,
  CreditCard,
  Calculator,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const individualNavItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/budget', icon: PieChart, label: 'Budget' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/reports', icon: FileBarChart, label: 'Reports' },
];

const businessNavItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/budget', icon: PieChart, label: 'Budget' },
  { path: '/debt-book', icon: BookOpen, label: 'Debtors' },
  { path: '/business/reports', icon: FileBarChart, label: 'Reports' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useUser();
  
  const navItems = userType === 'individual' ? individualNavItems : businessNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-0.5 transition-all duration-200",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
