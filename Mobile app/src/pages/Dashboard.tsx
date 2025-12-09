import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowRight, 
  Plus, Activity, Smartphone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/features/MetricCard';
import { HealthScoreRing } from '@/components/features/HealthScoreRing';
import { TransactionItem } from '@/components/features/TransactionItem';
import { EcocashDialog } from '@/components/features/EcocashDialog';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '@/services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    monthlyIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    budgetHealthScore: 0,
    incomeChange: 0,
    expenseChange: 0,
    savingsChange: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userName, setUserName] = useState('User');
  const [greeting, setGreeting] = useState('Good morning');
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showEcocash, setShowEcocash] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserName(JSON.parse(storedUser).name || 'User');
      } catch (e) {}
    }

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

    const fetchData = async () => {
      try {
        const txnRes = await transactionAPI.getAll();
        
        const allTxns = Array.isArray(txnRes.data) ? txnRes.data : (txnRes.data?.results || []);
        console.log('Transaction count:', allTxns.length);
        
        const budgets: any[] = [];

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        
        const currentMonthTxns = allTxns.filter((t: any) => 
          new Date(t.transaction_date) >= monthStart && t.status === 'completed'
        );
        const lastMonthTxns = allTxns.filter((t: any) => {
          const d = new Date(t.transaction_date);
          return d >= lastMonthStart && d <= lastMonthEnd && t.status === 'completed';
        });
        const last3MonthsTxns = allTxns.filter((t: any) => 
          new Date(t.transaction_date) >= threeMonthsAgo && t.status === 'completed'
        );
        
        const income = currentMonthTxns.filter((t: any) => t.transaction_type === 'income')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
        const expenses = currentMonthTxns.filter((t: any) => t.transaction_type === 'expense')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
        const lastIncome = lastMonthTxns.filter((t: any) => t.transaction_type === 'income')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
        const lastExpenses = lastMonthTxns.filter((t: any) => t.transaction_type === 'expense')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
        
        const netSavings = income - expenses;
        const lastNetSavings = lastIncome - lastExpenses;
        
        // Income Stability (20 points)
        const incomeMonths = last3MonthsTxns.filter((t: any) => t.transaction_type === 'income')
          .reduce((acc: any, t: any) => {
            const month = new Date(t.transaction_date).getMonth();
            acc[month] = (acc[month] || 0) + parseFloat(t.amount);
            return acc;
          }, {});
        const incomeValues = Object.values(incomeMonths) as number[];
        const avgIncome = incomeValues.length > 0 ? incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length : 0;
        const incomeVariance = incomeValues.length > 1 ? 
          incomeValues.reduce((sum, val) => sum + Math.pow(val - avgIncome, 2), 0) / incomeValues.length : 0;
        const incomeStability = avgIncome > 0 ? Math.max(0, 20 - (Math.sqrt(incomeVariance) / avgIncome) * 20) : 0;
        
        // Expense Ratio (25 points)
        const expenseRatio = income > 0 ? (expenses / income) : 1;
        const expenseScore = Math.max(0, 25 * (1 - Math.min(expenseRatio, 1)));
        
        // Savings Rate (25 points)
        const savingsRate = income > 0 ? (netSavings / income) : 0;
        const savingsScore = Math.max(0, Math.min(25, savingsRate * 25));
        
        // Budget Adherence (20 points)
        let budgetScore = 0;
        if (budgets.length > 0) {
          const adherenceScores = budgets.map((b: any) => {
            const spent = currentMonthTxns
              .filter((t: any) => t.category === b.category && t.transaction_type === 'expense')
              .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
            const budgeted = parseFloat(b.amount || 0);
            return budgeted > 0 ? Math.max(0, 1 - Math.abs(spent - budgeted) / budgeted) : 0;
          });
          budgetScore = (adherenceScores.reduce((a, b) => a + b, 0) / budgets.length) * 20;
        }
        
        // Debt Ratio (10 points) - assuming no debt tracking for now
        const debtScore = 10;
        
        const healthScore = Math.round(incomeStability + expenseScore + savingsScore + budgetScore + debtScore);
        
        setMetrics({
          monthlyIncome: income,
          totalExpenses: expenses,
          netSavings,
          budgetHealthScore: healthScore,
          incomeChange: lastIncome > 0 ? Math.round(((income - lastIncome) / lastIncome) * 100) : (income > 0 ? 100 : 0),
          expenseChange: lastExpenses > 0 ? Math.round(((expenses - lastExpenses) / lastExpenses) * 100) : (expenses > 0 ? 100 : 0),
          savingsChange: lastNetSavings !== 0 ? Math.round(((netSavings - lastNetSavings) / Math.abs(lastNetSavings)) * 100) : (netSavings !== 0 ? 100 : 0),
        });
        
        const recentTxns = allTxns
          .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
          .slice(0, 4)
          .map((t: any) => ({
            id: t.id,
            amount: parseFloat(t.amount),
            type: t.transaction_type,
            category: { name: t.category_name || 'Other', icon: 'Wallet', color: '#2D358B' },
            description: t.description,
            date: t.transaction_date,
            status: t.status
          }));
        
        setTransactions(recentTxns);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="text-muted-foreground text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold">{userName.split(' ')[0]}</h1>
      </div>

      {/* Financial Health Score */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">NET INCOME</p>
            <h2 className="text-3xl font-bold mt-1">
              ${metrics.netSavings.toLocaleString()}
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-1">Net Savings this month</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{metrics.savingsChange > 0 ? '+' : ''}{metrics.savingsChange.toFixed(1)}%</span>
              </div>
              <span className="text-primary-foreground/60 text-xs">vs last month</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary-foreground/80 text-xs font-medium mb-2">Financial Health</p>
            <HealthScoreRing 
              score={metrics.budgetHealthScore} 
              size="md"
              className="[&_span]:text-primary-foreground [&>span]:text-primary-foreground/90"
            />
          </div>
        </div>
      </div>

      {/* Ecocash Button */}
      <div className="animate-fade-up stagger-2">
        <Button 
          variant="default" 
          className="w-full h-12 bg-orange-600 hover:bg-orange-700"
          onClick={() => setShowEcocash(true)}
        >
          <Smartphone className="w-4 h-4" />
          Ecocash
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 animate-fade-up stagger-2">
        <Button 
          variant="gradient" 
          className="flex-1 h-12"
          onClick={() => navigate('/transactions/add')}
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-12"
          onClick={() => navigate('/reports')}
        >
          <Activity className="w-4 h-4" />
          View Reports
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-3">
        <MetricCard
          title="Monthly Income"
          value={`$${metrics.monthlyIncome.toLocaleString()}`}
          change={metrics.incomeChange}
          icon={Wallet}
          variant="income"
        />
        <MetricCard
          title="Total Expenses"
          value={`$${metrics.totalExpenses.toLocaleString()}`}
          change={metrics.expenseChange}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3 animate-fade-up stagger-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Transactions</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => navigate('/transactions')}
          >
            See all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                onClick={() => setSelectedTransaction(transaction)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-fade-up stagger-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Smart Insight</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You're spending 12% less on dining this month. Keep it up to reach your savings goal faster!
            </p>
          </div>
        </div>
      </div>

      {showEcocash && (
        <EcocashDialog onClose={() => setShowEcocash(false)} />
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedTransaction(null)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)}>
                <span className="text-2xl">&times;</span>
              </Button>
            </div>
            
            <div className={`p-6 rounded-xl mb-4 ${
              selectedTransaction.type === 'income' 
                ? 'bg-success/10 border border-success/20' 
                : 'bg-destructive/10 border border-destructive/20'
            }`}>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <h3 className={`text-3xl font-bold ${
                selectedTransaction.type === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
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
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  selectedTransaction.status === 'completed' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-warning/10 text-warning'
                }`}>
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
