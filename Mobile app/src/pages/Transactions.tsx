import { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/features/TransactionItem';
import { mockTransactions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const filters = ['All', 'Income', 'Expense', 'Transfer'];

export default function Transactions() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesFilter = activeFilter === 'All' || t.type.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">Track your money flow</p>
        </div>
        <Button 
          size="icon"
          onClick={() => navigate('/transactions/add')}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-1">
        <div className="p-4 rounded-xl bg-income/10 border border-income/20">
          <p className="text-xs text-muted-foreground font-medium">Total Income</p>
          <p className="text-xl font-bold text-income mt-1">
            +${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-expense/10 border border-expense/20">
          <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
          <p className="text-xl font-bold text-expense mt-1">
            -${totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative animate-fade-up stagger-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-up stagger-3">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "flex-shrink-0",
              activeFilter === filter && "shadow-card"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2 animate-fade-up stagger-4">
        {filteredTransactions.length > 0 ? (
          <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
            {filteredTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                onClick={() => navigate(`/transactions/${transaction.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
