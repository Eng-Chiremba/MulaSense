import { 
  Shield, Laptop, Plane, Car, Target, GraduationCap, Wallet 
} from 'lucide-react';
import { Goal } from '@/types';
import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
  onUpdate?: (goalId: string, newAmount: number) => void;
}

export function GoalCard({ goal, onClick, onUpdate }: GoalCardProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const Icon = iconMap[goal.icon] || Target;
  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

  const quickAmount = Math.min(Math.ceil(remaining / 10 / 50) * 50, 500);

  const handleQuickAdd = (amount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onUpdate) {
      onUpdate(goal.id, goal.currentAmount + amount);
    }
  };

  const handleCustomAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (customAmount && onUpdate) {
      onUpdate(goal.id, goal.currentAmount + parseFloat(customAmount));
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-info/10 text-info';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-card shadow-card border border-border/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
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
        {!showCustomInput ? (
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="flex-1 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors"
              onClick={(e) => handleQuickAdd(50, e)}
            >
              +$50
            </button>
            <button
              type="button"
              className="flex-1 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors"
              onClick={(e) => handleQuickAdd(quickAmount, e)}
            >
              +${quickAmount}
            </button>
            <button
              type="button"
              className="flex-1 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowCustomInput(true); }}
            >
              Custom
            </button>
          </div>
        ) : (
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Input
              type="number"
              placeholder="Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-9 text-xs"
            />
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={handleCustomAdd}
              disabled={!customAmount}
            >
              Add
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-accent transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowCustomInput(false); }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
