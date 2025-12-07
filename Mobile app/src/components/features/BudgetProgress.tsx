import { 
  UtensilsCrossed, Car, ShoppingBag, Receipt, Gamepad2, 
  Heart, GraduationCap, Wallet 
} from 'lucide-react';
import { BudgetCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
  Wallet,
};

interface BudgetProgressProps {
  category: BudgetCategory;
  onClick?: () => void;
}

export function BudgetProgress({ category, onClick }: BudgetProgressProps) {
  const Icon = iconMap[category.icon] || Wallet;
  const percentage = Math.round((category.spentAmount / category.budgetedAmount) * 100);
  const remaining = category.budgetedAmount - category.spentAmount;
  
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusText = () => {
    if (percentage >= 100) return 'Over budget!';
    if (percentage >= 90) return 'Almost at limit';
    if (percentage >= 75) return 'Watch spending';
    return 'On track';
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl bg-card shadow-card border border-border/50 text-left transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color: category.color }} 
            />
          </div>
          <div>
            <p className="font-medium text-sm">{category.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{category.period}</p>
          </div>
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          percentage >= 90 && "bg-destructive/10 text-destructive",
          percentage >= 75 && percentage < 90 && "bg-warning/10 text-warning",
          percentage < 75 && "bg-success/10 text-success"
        )}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", getProgressColor())}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            ${category.spentAmount.toLocaleString()} of ${category.budgetedAmount.toLocaleString()}
          </span>
          <span className={cn(
            "font-medium",
            remaining < 0 ? "text-destructive" : "text-foreground"
          )}>
            {remaining >= 0 ? `$${remaining.toLocaleString()} left` : `$${Math.abs(remaining).toLocaleString()} over`}
          </span>
        </div>
      </div>
    </button>
  );
}
