import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, TrendingDown, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function BudgetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const found = budgets.find((b: any) => b.id === id);
    setBudget(found);
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const updated = budgets.filter((b: any) => b.id !== id);
    localStorage.setItem('budgets', JSON.stringify(updated));
    
    toast({
      title: 'Budget deleted',
    });
    navigate('/budget');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Budget not found</p>
      </div>
    );
  }

  const percentage = budget.budgetedAmount > 0 ? (budget.spentAmount / budget.budgetedAmount) * 100 : 0;
  const remaining = budget.budgetedAmount - budget.spentAmount;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Budget Details</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-5 h-5 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Budget Amount</p>
          <h2 className="text-4xl font-bold text-primary">
            ${budget.budgetedAmount.toLocaleString()}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">per month</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Spending Progress</span>
            <span className="text-sm font-bold">{Math.round(percentage)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-3">
            <div 
              className={`h-full rounded-full transition-all ${
                percentage >= 100 ? 'bg-destructive' :
                percentage >= 75 ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${budget.spentAmount.toLocaleString()} spent
            </span>
            <span className={remaining >= 0 ? 'text-success' : 'text-destructive'}>
              ${Math.abs(remaining).toLocaleString()} {remaining >= 0 ? 'left' : 'over'}
            </span>
          </div>
        </div>

        {percentage >= 90 && (
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Budget Alert</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {percentage >= 100 ? 'You have exceeded your budget limit!' : 'You are approaching your budget limit.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Category Name</p>
              <p className="font-medium">{budget.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Priority</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                budget.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                budget.priority === 'medium' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
                {budget.priority}
              </span>
            </div>
          </div>

          {budget.isBill && (
            <>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Bill Type</p>
                  <p className="font-medium">Recurring Bill</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm">{budget.autoPayBill ? 'Auto-pay enabled' : 'Manual payment'}</p>
                </div>
              </div>

              {budget.billDueDate && (
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                    <p className="text-sm">{budget.billDueDate}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-card border text-center">
            <p className="text-xs text-muted-foreground">Daily Average</p>
            <p className="text-xl font-bold mt-1">
              ${Math.round(budget.spentAmount / new Date().getDate()).toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border text-center">
            <p className="text-xs text-muted-foreground">Days Left</p>
            <p className="text-xl font-bold mt-1">
              {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
