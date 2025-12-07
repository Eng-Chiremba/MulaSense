import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AddBudget() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    budgetAmount: '',
    period: 'monthly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newBudget = {
        id: Date.now().toString(),
        name: formData.category,
        icon: 'Wallet',
        color: '#2D358B',
        budgetedAmount: parseFloat(formData.budgetAmount),
        spentAmount: 0,
        period: formData.period,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      };

      const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      localStorage.setItem('budgets', JSON.stringify([...existingBudgets, newBudget]));

      toast({
        title: 'Budget created!',
        description: `${formData.category} budget has been added.`,
      });
      
      navigate('/budget', { state: { refresh: true } });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create budget. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/logo.ico" alt="MulaSense Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold">Add Budget</h1>
          <p className="text-muted-foreground mt-2">Set your spending limits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="category"
                  placeholder="e.g., Food & Dining, Transport"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="budgetAmount"
                  type="number"
                  placeholder="500"
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Budget Period</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full h-12" variant="gradient" disabled={loading}>
            {loading ? 'Creating Budget...' : 'Create Budget'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button onClick={() => navigate('/budget')} className="text-primary font-medium hover:underline">
            Back to Budget
          </button>
        </p>
      </div>
    </div>
  );
}
