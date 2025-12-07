import { TrendingUp, DollarSign, TrendingDown, Activity, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/features/MetricCard';
import { mockBusinessMetrics, mockBusinessTransactions, mockBusinessUser } from '@/data/businessMockData';
import { useNavigate } from 'react-router-dom';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const recentTransactions = mockBusinessTransactions.slice(0, 4);

  return (
    <div className="p-4 space-y-6">
      <div className="animate-fade-up">
        <p className="text-muted-foreground text-sm">Business Dashboard</p>
        <h1 className="text-2xl font-bold">{mockBusinessUser.businessName}</h1>
      </div>

      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Net Profit</p>
            <h2 className="text-3xl font-bold mt-1">
              ${mockBusinessMetrics.netProfit.toLocaleString()}
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-1">This month</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{mockBusinessMetrics.profitMargin}%</span>
              </div>
              <span className="text-primary-foreground/60 text-xs">Profit Margin</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-primary-foreground/80 text-xs">Cash Flow</div>
            <div className="text-2xl font-bold">${mockBusinessMetrics.cashFlow.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 animate-fade-up stagger-2">
        <Button 
          variant="gradient" 
          className="flex-1 h-12"
          onClick={() => navigate('/business/transactions/add')}
        >
          <Plus className="w-4 h-4" />
          Record Sale
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

      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-3">
        <MetricCard
          title="Revenue"
          value={`$${mockBusinessMetrics.monthlyRevenue.toLocaleString()}`}
          change={mockBusinessMetrics.revenueChange}
          icon={DollarSign}
          variant="income"
        />
        <MetricCard
          title="Expenses"
          value={`$${mockBusinessMetrics.monthlyExpenses.toLocaleString()}`}
          change={mockBusinessMetrics.expenseChange}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      <div className="space-y-3 animate-fade-up stagger-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Transactions</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => navigate('/business/transactions')}
          >
            See all
          </Button>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.type === 'sale' ? 'bg-primary/10' : 'bg-destructive/10'
                }`}>
                  <Activity className={`w-5 h-5 ${
                    transaction.type === 'sale' ? 'text-primary' : 'text-destructive'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'sale' ? 'text-primary' : 'text-destructive'
                }`}>
                  {transaction.type === 'sale' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-fade-up stagger-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Business Insight</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Revenue increased by {mockBusinessMetrics.revenueChange}% this month. Consider expanding marketing efforts to maintain growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
