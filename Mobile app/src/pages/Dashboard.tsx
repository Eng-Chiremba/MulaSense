import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowRight, 
  Plus, Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/features/MetricCard';
import { HealthScoreRing } from '@/components/features/HealthScoreRing';
import { TransactionItem } from '@/components/features/TransactionItem';
import { mockDashboardMetrics, mockTransactions, mockUser } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { reportAPI, transactionAPI } from '@/services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(mockDashboardMetrics);
  const [transactions, setTransactions] = useState(mockTransactions.slice(0, 4));
  const [userName, setUserName] = useState('User');
  const [greeting, setGreeting] = useState('Good morning');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'User');
    }

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    const fetchData = async () => {
      try {
        const [dashboardRes, transactionsRes] = await Promise.all([
          reportAPI.getDashboard(),
          transactionAPI.getAll(),
        ]);
        
        setMetrics(dashboardRes.data);
        setTransactions(transactionsRes.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data if API fails
        setMetrics(mockDashboardMetrics);
        setTransactions(mockTransactions.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const recentTransactions = transactions;

  return (
    <div className="p-4 space-y-6">
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="text-muted-foreground text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold">{userName.split(' ')[0]}</h1>
      </div>

      {/* Financial Health Score */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Financial Health</p>
            <h2 className="text-3xl font-bold mt-1">
              ${metrics.netSavings.toLocaleString()}
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-1">Net Savings this month</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">+{metrics.savingsChange}%</span>
              </div>
              <span className="text-primary-foreground/60 text-xs">vs last month</span>
            </div>
          </div>
          <HealthScoreRing 
            score={metrics.budgetHealthScore} 
            size="md"
            className="[&_span]:text-primary-foreground [&>span]:text-primary-foreground/90"
          />
        </div>
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
          {recentTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
              onClick={() => navigate(`/transactions/${transaction.id}`)}
            />
          ))}
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
    </div>
  );
}
