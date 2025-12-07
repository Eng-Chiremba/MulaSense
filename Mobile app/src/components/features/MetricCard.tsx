import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  variant?: 'default' | 'income' | 'expense' | 'savings';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  iconColor,
  variant = 'default',
  className 
}: MetricCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className={cn(
      "p-4 rounded-2xl bg-card shadow-card border border-border/50 transition-all duration-300 hover:shadow-lg",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          variant === 'income' && "bg-income/10",
          variant === 'expense' && "bg-expense/10",
          variant === 'savings' && "bg-savings/10",
          variant === 'default' && "bg-primary/10"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            variant === 'income' && "text-income",
            variant === 'expense' && "text-expense",
            variant === 'savings' && "text-savings",
            variant === 'default' && "text-primary"
          )} style={iconColor ? { color: iconColor } : undefined} />
        </div>
        
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className={cn(
          "text-xl font-bold mt-0.5",
          variant === 'income' && "text-income",
          variant === 'expense' && "text-expense",
          variant === 'savings' && "text-savings"
        )}>
          {value}
        </p>
      </div>
    </div>
  );
}
