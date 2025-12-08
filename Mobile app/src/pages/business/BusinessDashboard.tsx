import { TrendingUp, DollarSign, TrendingDown, Activity, Plus, FileText, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/features/MetricCard';
import { useNavigate } from 'react-router-dom';
import { calculateTaxBreakdown } from '@/lib/taxCalculator';
import { businessAPI } from '@/services/api';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Transaction } from '@/types/transaction';

interface DashboardData {
  financial_summary: {
    monthly_income: number;
    monthly_expenses: number;
    net_savings: number;
    savings_rate: number;
    income_change: number;
    expense_change: number;
    savings_change: number;
  };
  recent_transactions: Transaction[];
}

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await businessAPI.getMetrics();
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const summary = data?.financial_summary;
  const transactions = data?.recent_transactions || [];
  const taxBreakdown = summary ? calculateTaxBreakdown(summary.net_savings ?? 0, summary.monthly_income ?? 0, 0) : null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Business Dashboard</p>
          <h1 className="text-2xl font-bold">{user?.business_name || 'Business'}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {summary && (
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Net Savings</p>
            <h2 className="text-3xl font-bold mt-1">
              ${(summary.net_savings ?? 0).toLocaleString()}
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-1">This month</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{summary.savings_rate ?? 0}%</span>
              </div>
              <span className="text-primary-foreground/60 text-xs">Savings Rate</span>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="flex gap-3">
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
          onClick={() => navigate('/business/reports')}
        >
          <FileText className="w-4 h-4" />
          Reports
        </Button>
      </div>

      {summary && (
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Income"
          value={`$${(summary.monthly_income ?? 0).toLocaleString()}`}
          change={summary.income_change}
          icon={DollarSign}
          variant="income"
        />
        <MetricCard
          title="Expenses"
          value={`$${(summary.monthly_expenses ?? 0).toLocaleString()}`}
          change={summary.expense_change}
          icon={TrendingDown}
          variant="expense"
        />
      </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Transactions ({transactions.length})</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => navigate('/transactions')}
          >
            See all
          </Button>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-border/50">
          {transactions.length > 0 ? (
            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.transaction_type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                      <Activity className={`w-5 h-5 ${
                        transaction.transaction_type === 'income' ? 'text-primary' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.transaction_type === 'income' ? 'text-primary' : 'text-destructive'
                    }`}>
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

      <div className="grid grid-cols-2 gap-3">
        {summary && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Business Insight</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Income {(summary.income_change ?? 0) >= 0 ? 'increased' : 'decreased'} by {Math.abs(summary.income_change ?? 0)}% this month.
              </p>
            </div>
          </div>
        </div>
        )}
        
        {taxBreakdown && (
        <div className="p-4 rounded-2xl bg-[#2D358B]/5 border border-[#2D358B]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D358B]/10 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-[#2D358B]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Tax Liability</h4>
              <p className="text-xl font-bold text-[#2D358B] mt-1">${(taxBreakdown.totalTax ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Estimated annual</p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
