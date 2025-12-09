import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/features/TransactionItem';
import { mockTransactions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { transactionAPI } from '@/services/api';

const filters = ['All', 'Income', 'Expense', 'Transfer'];

export default function Transactions() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = activeFilter === 'All' || t.transaction_type?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalExpense = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

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
        <div className="p-4 rounded-xl border border-border/50" style={{ backgroundColor: '#2D358B15' }}>
          <p className="text-xs text-muted-foreground font-medium">Total Income</p>
          <p className="text-xl font-bold mt-1" style={{ color: '#2D358B' }}>
            +${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/50" style={{ backgroundColor: '#89221f15' }}>
          <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
          <p className="text-xl font-bold mt-1" style={{ color: '#89221f' }}>
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
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
            {filteredTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={{
                  ...transaction,
                  type: transaction.transaction_type,
                  date: transaction.transaction_date,
                  category: { name: transaction.category_name || 'Other', color: '#2D358B', icon: 'Wallet' }
                }}
                onClick={() => setSelectedTransaction({
                  ...transaction,
                  type: transaction.transaction_type,
                  category: { name: transaction.category_name || 'Other' },
                  date: transaction.transaction_date
                })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/transactions/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedTransaction(null)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)}>
                <span className="text-2xl">&times;</span>
              </Button>
            </div>
            
            <div className="p-6 rounded-xl mb-4 border" style={{
              backgroundColor: selectedTransaction.type === 'income' ? '#2D358B15' : '#89221f15',
              borderColor: selectedTransaction.type === 'income' ? '#2D358B30' : '#89221f30'
            }}>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <h3 style={{ color: selectedTransaction.type === 'income' ? '#2D358B' : '#89221f' }} className="text-3xl font-bold">
                {selectedTransaction.type === 'income' ? '+' : '-'}${parseFloat(selectedTransaction.amount).toLocaleString()}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{selectedTransaction.category?.name || 'Other'}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(selectedTransaction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize" style={{
                  backgroundColor: selectedTransaction.status === 'completed' ? '#2D358B15' : '#FFA50015',
                  color: selectedTransaction.status === 'completed' ? '#2D358B' : '#FFA500'
                }}>
                  {selectedTransaction.status}
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={() => {
                setSelectedTransaction(null);
                navigate(`/transactions/${selectedTransaction.id}`);
              }}
            >
              View Full Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
