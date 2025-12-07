import { useState, useEffect } from 'react';
import { Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BudgetProgress } from '@/components/features/BudgetProgress';
import { mockBudgetCategories } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Budget() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState(mockBudgetCategories);

  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const allBudgets = [...mockBudgetCategories, ...savedBudgets];
    setBudgets(allBudgets);
  }, []);

  const totalBudgeted = budgets.reduce((sum, c) => sum + c.budgetedAmount, 0);
  const totalSpent = budgets.reduce((sum, c) => sum + c.spentAmount, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalBudgeted) * 100);

  const overBudgetCategories = budgets.filter(
    c => (c.spentAmount / c.budgetedAmount) >= 0.9
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="text-sm text-muted-foreground">Manage your spending limits</p>
        </div>
        <Button 
          size="icon"
          onClick={() => navigate('/budget/add')}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Overview Card */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Monthly Budget</p>
            <h2 className="text-3xl font-bold mt-1">${totalBudgeted.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm font-medium">Spent</p>
            <p className="text-2xl font-bold">{overallPercentage}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary-foreground transition-all duration-500"
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary-foreground/80">
              ${totalSpent.toLocaleString()} spent
            </span>
            <span className="font-medium">
              ${totalRemaining.toLocaleString()} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 animate-fade-up stagger-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Budget Alerts</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category is' : 'categories are'} approaching or over the limit
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-3">
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Categories</p>
          <p className="text-xl font-bold mt-1">{budgets.length}</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">On Track</p>
          <p className="text-xl font-bold text-success mt-1">
            {budgets.filter(c => (c.spentAmount / c.budgetedAmount) < 0.75).length}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">At Risk</p>
          <p className="text-xl font-bold text-warning mt-1">
            {overBudgetCategories.length}
          </p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-3 animate-fade-up stagger-4">
        <h3 className="font-semibold">Budget Categories</h3>
        <div className="space-y-3">
          {budgets.map((category) => (
            <BudgetProgress 
              key={category.id} 
              category={category}
              onClick={() => navigate(`/budget/${category.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
