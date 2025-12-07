import { 
  Shield, Laptop, Plane, Car, Target, GraduationCap, Wallet 
} from 'lucide-react';
import { Goal } from '@/types';
import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Laptop,
  Plane,
  Car,
  Target,
  GraduationCap,
  Wallet,
};

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const Icon = iconMap[goal.icon] || Target;
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-info/10 text-info';
    }
  };

  return (
    <div
      className="p-4 rounded-2xl bg-card shadow-card border border-border/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            <Icon 
              className="w-6 h-6" 
              style={{ color: goal.color }} 
            />
          </div>
          <div>
            <p className="font-semibold">{goal.name}</p>
            <p className="text-xs text-muted-foreground">{goal.category}</p>
          </div>
        </div>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full capitalize", getPriorityColor())}>
          {goal.priority}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: goal.color 
              }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-medium">{percentage}% complete</span>
            <span className="text-muted-foreground">{daysLeft} days left</span>
          </div>
        </div>
        
        {/* Amount info */}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="font-semibold text-income">${goal.currentAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="font-semibold">${goal.targetAmount.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Quick add buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            +$50
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            +$100
          </Button>
          <Button variant="default" size="sm" className="flex-1 text-xs">
            Custom
          </Button>
        </div>
      </div>
    </div>
  );
}
