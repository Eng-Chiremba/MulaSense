import { useState } from 'react';
import { 
  FileBarChart, Download, Calendar, TrendingUp, TrendingDown,
  PieChart, BarChart3, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockDashboardMetrics, mockBudgetCategories, mockTransactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

const periods = ['Week', 'Month', 'Year'];

const reportTypes = [
  { 
    id: 'summary', 
    title: 'Income & Expense Summary', 
    icon: BarChart3,
    description: 'Overview of your income and expenses'
  },
  { 
    id: 'category', 
    title: 'Category Breakdown', 
    icon: PieChart,
    description: 'Spending by category analysis'
  },
  { 
    id: 'pnl', 
    title: 'Profit & Loss', 
    icon: TrendingUp,
    description: 'Net profit calculation report'
  },
  { 
    id: 'cashflow', 
    title: 'Cash Flow', 
    icon: FileBarChart,
    description: 'Money movement analysis'
  },
];

export default function Reports() {
  const [activePeriod, setActivePeriod] = useState('Month');

  const totalIncome = mockDashboardMetrics.monthlyIncome;
  const totalExpenses = mockDashboardMetrics.totalExpenses;
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = Math.round((netBalance / totalIncome) * 100);

  // Category data for simple visualization
  const categoryData = mockBudgetCategories.map(c => ({
    name: c.name,
    amount: c.spentAmount,
    color: c.color,
    percentage: Math.round((c.spentAmount / totalExpenses) * 100)
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">Financial analytics & insights</p>
        </div>
        <Button variant="outline" size="icon">
          <Download className="w-5 h-5" />
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 animate-fade-up stagger-1">
        {periods.map((period) => (
          <Button
            key={period}
            variant={activePeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePeriod(period)}
            className={cn(
              "flex-1",
              activePeriod === period && "shadow-card"
            )}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Net Balance</p>
            <h2 className="text-3xl font-bold mt-1">${netBalance.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm font-medium">Savings Rate</p>
            <p className="text-2xl font-bold">{savingsRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-primary-foreground/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Income</span>
            </div>
            <p className="text-xl font-bold">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-foreground/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Expenses</span>
            </div>
            <p className="text-xl font-bold">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 animate-fade-up stagger-3">
        <h3 className="font-semibold">Top Spending Categories</h3>
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4 space-y-4">
          {categoryData.slice(0, 4).map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-muted-foreground">
                  ${category.amount.toLocaleString()} ({category.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Types */}
      <div className="space-y-3 animate-fade-up stagger-4">
        <h3 className="font-semibold">Available Reports</h3>
        <div className="grid gap-3">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50 text-left hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <report.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
