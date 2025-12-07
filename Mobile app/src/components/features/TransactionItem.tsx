import { 
  Wallet, Briefcase, TrendingUp, UtensilsCrossed, Car, 
  ShoppingBag, Receipt, Gamepad2, Heart, GraduationCap 
} from 'lucide-react';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  Briefcase,
  TrendingUp,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
};

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const Icon = iconMap[transaction.category.icon] || Wallet;
  const isIncome = transaction.type === 'income';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors text-left"
    >
      <div 
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${transaction.category.color}15` }}
      >
        <Icon 
          className="w-5 h-5" 
          style={{ color: transaction.category.color }} 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {transaction.category.name} • {format(new Date(transaction.date), 'MMM d')}
        </p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          "font-semibold text-sm",
          isIncome ? "text-income" : "text-expense"
        )}>
          {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className={cn(
          "text-xs capitalize",
          transaction.status === 'completed' && "text-success",
          transaction.status === 'pending' && "text-warning",
          transaction.status === 'cancelled' && "text-muted-foreground"
        )}>
          {transaction.status}
        </p>
      </div>
    </button>
  );
}
