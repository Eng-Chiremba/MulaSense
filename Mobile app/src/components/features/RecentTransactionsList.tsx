import { Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Transactions ({transactions.length})</h3>
        <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/transactions')}>
          See all
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border/50">
        {transactions.length > 0 ? (
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.transaction_type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                    <Activity className={`w-5 h-5 ${transaction.transaction_type === 'income' ? 'text-primary' : 'text-destructive'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category?.name || 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.transaction_type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-2">No recent transactions</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/transactions/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}