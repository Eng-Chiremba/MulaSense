import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function EditGoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [purpose, setPurpose] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState('medium');

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const goal = goals.find((g: any) => g.id === id);
    
    if (goal) {
      setPurpose(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(goal.deadline);
      setUrgency(goal.priority);
    } else {
      toast({
        title: 'Goal not found',
        variant: 'destructive',
      });
      navigate('/goals');
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) => {
      if (g.id === id) {
        return {
          ...g,
          name: purpose,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(currentAmount),
          deadline,
          priority: urgency,
        };
      }
      return g;
    });

    localStorage.setItem('goals', JSON.stringify(updatedGoals));

    toast({
      title: 'Goal updated successfully',
    });

    navigate('/goals');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const filteredGoals = goals.filter((g: any) => g.id !== id);
      localStorage.setItem('goals', JSON.stringify(filteredGoals));

      toast({
        title: 'Goal deleted',
      });

      navigate('/goals');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/goals')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12">
            <img src="/logo.ico" alt="MulaSense Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold">Edit Goal</h1>
          <p className="text-muted-foreground mt-1">Update your financial goal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Goal Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g., Emergency Fund"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount ($)</Label>
              <Input
                id="currentAmount"
                type="number"
                placeholder="1000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      urgency === level
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full h-12" variant="gradient">
              Update Goal
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="w-full h-12"
              variant="destructive"
            >
              Delete Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
