import { useState, useEffect } from 'react';
import { Plus, TrendingUp, AlertTriangle, Sparkles, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BudgetProgress } from '@/components/features/BudgetProgress';
import { useNavigate } from 'react-router-dom';
import { budgetAPI, aiAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function Budget() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    setBudgets(savedBudgets);
    setLoading(false);
    if (savedBudgets.length > 0) {
      fetchAIAdvice();
    }
  }, []);





  const fetchAIAdvice = async () => {
    setLoadingAI(true);
    try {
      const response = await aiAPI.chat('Analyze my budget and provide recommendations for cuts and improvements');
      setAiAdvice(response.data.response || 'No recommendations available at this time.');
    } catch (error) {
      console.error('Failed to fetch AI advice:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const totalBudgeted = budgets.reduce((sum, c) => sum + (c.budgetedAmount || 0), 0);
  const totalSpent = budgets.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const overBudgetCategories = budgets.filter(
    c => c.budgetedAmount > 0 && (c.spentAmount / c.budgetedAmount) >= 0.9
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="text-sm text-muted-foreground">Manage your spending limits</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/budget/kashagi')}
          >
            Get Kashagi
          </Button>
          <Button 
            size="icon"
            onClick={() => navigate('/budget/add')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
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
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 animate-fade-up stagger-3">
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
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-2">
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Categories</p>
          <p className="text-xl font-bold mt-1">{budgets.length}</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">On Track</p>
          <p className="text-xl font-bold text-success mt-1">
            {budgets.filter(c => c.budgetedAmount > 0 && (c.spentAmount / c.budgetedAmount) < 0.75).length}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">At Risk</p>
          <p className="text-xl font-bold text-warning mt-1">
            {overBudgetCategories.length}
          </p>
        </div>
      </div>

      {/* Bills Section */}
      {budgets.filter(b => b.isBill).length > 0 && (
        <div className="space-y-3 animate-fade-up stagger-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recurring Bills
            </h3>
            <Badge variant="secondary">{budgets.filter(b => b.isBill).length}</Badge>
          </div>
          <div className="space-y-2">
            {budgets.filter(b => b.isBill).map((bill) => (
              <div key={bill.id} className="p-3 rounded-xl bg-card border flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">${bill.budgetedAmount}/month</p>
                </div>
                {bill.autoPayBill && (
                  <Badge variant="default" className="gap-1">
                    <Zap className="w-3 h-3" />
                    Auto-pay
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="space-y-3 animate-fade-up stagger-4">
        <h3 className="font-semibold">Budget Categories</h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No budget categories yet</p>
            <Button onClick={() => navigate('/budget/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.filter(b => !b.isBill).map((category) => (
              <div key={category.id} className="relative">
                {category.priority === 'high' && (
                  <Badge className="absolute -top-2 -right-2 z-10" variant="destructive">High Priority</Badge>
                )}
                <BudgetProgress 
                  category={category}
                  onClick={() => setSelectedBudget(category)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Budget Advice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 animate-fade-up stagger-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm mb-2">AI Budget Advisor</p>
            {loadingAI ? (
              <p className="text-sm text-muted-foreground">Analyzing your budget...</p>
            ) : (
              <p className="text-sm text-muted-foreground">{aiAdvice}</p>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 h-8 text-xs"
              onClick={fetchAIAdvice}
              disabled={loadingAI}
            >
              Refresh Advice
            </Button>
          </div>
        </div>
      </div>

      {selectedBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedBudget(null)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Budget Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedBudget(null)}>
                <span className="text-2xl">&times;</span>
              </Button>
            </div>
            
            <div className="p-6 rounded-xl mb-4 bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Budget Amount</p>
              <h3 className="text-3xl font-bold text-primary">
                ${selectedBudget.budgetedAmount.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Spent: ${selectedBudget.spentAmount.toLocaleString()} ({Math.round((selectedBudget.spentAmount / selectedBudget.budgetedAmount) * 100)}%)
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{selectedBudget.name}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="font-medium text-success">
                  ${(selectedBudget.budgetedAmount - selectedBudget.spentAmount).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Priority</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  selectedBudget.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                  selectedBudget.priority === 'medium' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {selectedBudget.priority}
                </span>
              </div>
              
              {selectedBudget.isBill && (
                <div>
                  <p className="text-xs text-muted-foreground">Bill Type</p>
                  <p className="font-medium">
                    {selectedBudget.autoPayBill ? 'Auto-pay enabled' : 'Manual payment'}
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={() => setSelectedBudget(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
