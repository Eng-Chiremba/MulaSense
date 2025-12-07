import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Tag, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { budgetAPI } from '@/services/api';

const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Savings',
  'Other',
];

export default function AddBudget() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budgetedAmount: '',
    priority: 'medium',
    isBill: false,
    autoPayBill: false,
    billDueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budgetedAmount) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const budgetData = {
        name: formData.name,
        budgeted_amount: parseFloat(formData.budgetedAmount),
        spent_amount: 0,
        priority: formData.priority,
        is_bill: formData.isBill,
        auto_pay_bill: formData.autoPayBill,
        bill_due_date: formData.billDueDate || null,
      };

      await budgetAPI.createCategory(budgetData);
      
      toast({
        title: 'Success',
        description: 'Budget category created successfully',
      });
      
      navigate('/budget');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create budget',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Add Budget Category</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="e.g., Food & Dining"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              list="categories"
              required
            />
            <datalist id="categories">
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Budget Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Budget Amount *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.budgetedAmount}
              onChange={(e) => setFormData({ ...formData, budgetedAmount: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Priority Level</Label>
          <div className="grid grid-cols-3 gap-2">
            {['high', 'medium', 'low'].map((priority) => (
              <Button
                key={priority}
                type="button"
                variant={formData.priority === priority ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, priority })}
                className="capitalize"
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        {/* Is Bill */}
        <div className="flex items-center justify-between p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="isBill" className="cursor-pointer">This is a recurring bill</Label>
              <p className="text-xs text-muted-foreground">Mark if this is a monthly bill</p>
            </div>
          </div>
          <Switch
            id="isBill"
            checked={formData.isBill}
            onCheckedChange={(checked) => setFormData({ ...formData, isBill: checked, autoPayBill: checked ? formData.autoPayBill : false })}
          />
        </div>

        {/* Auto Pay Bill */}
        {formData.isBill && (
          <>
            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <Label htmlFor="autoPay" className="cursor-pointer">Auto-pay this bill</Label>
                  <p className="text-xs text-muted-foreground">System will automatically pay monthly</p>
                </div>
              </div>
              <Switch
                id="autoPay"
                checked={formData.autoPayBill}
                onCheckedChange={(checked) => setFormData({ ...formData, autoPayBill: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Bill Due Date (Day of Month)</Label>
              <Input
                id="dueDate"
                type="number"
                min="1"
                max="31"
                placeholder="e.g., 15"
                value={formData.billDueDate}
                onChange={(e) => setFormData({ ...formData, billDueDate: e.target.value })}
              />
            </div>
          </>
        )}

        {/* AI Advice Notice */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">AI Budget Advisor</p>
              <p className="text-xs text-muted-foreground mt-1">
                Our AI will analyze your budget and provide personalized recommendations for cuts and improvements
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Budget'}
        </Button>
      </form>
    </div>
  );
}
