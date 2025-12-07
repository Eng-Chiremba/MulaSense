import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AddGoal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    purpose: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    urgency: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newGoal = {
        id: Date.now().toString(),
        name: formData.purpose,
        type: 'savings',
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        priority: formData.urgency,
        status: 'active',
        category: formData.purpose,
        icon: 'Target',
        color: '#2D358B',
      };

      const existingGoals = JSON.parse(localStorage.getItem('goals') || '[]');
      localStorage.setItem('goals', JSON.stringify([...existingGoals, newGoal]));

      toast({
        title: 'Goal created!',
        description: `${formData.purpose} has been added to your goals.`,
      });
      
      navigate('/goals', { state: { refresh: true } });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal. Please try again.',
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
          <h1 className="text-3xl font-bold">Add Goal</h1>
          <p className="text-muted-foreground mt-2">Set your savings target</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">What are you saving for?</Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="purpose"
                  placeholder="e.g., Emergency Fund, New Car"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">How much do you want to save?</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="10000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">How much have you saved so far?</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">When do you need this by?</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">How urgent is this goal?</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Need it soon</SelectItem>
                  <SelectItem value="medium">Medium - Can wait a bit</SelectItem>
                  <SelectItem value="low">Low - Long-term goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full h-12" variant="gradient" disabled={loading}>
            {loading ? 'Creating Goal...' : 'Create Goal'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button onClick={() => navigate('/goals')} className="text-primary font-medium hover:underline">
            Back to Goals
          </button>
        </p>
      </div>
    </div>
  );
}
