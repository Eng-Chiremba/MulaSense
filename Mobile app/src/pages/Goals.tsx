import { Plus, Target, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalCard } from '@/components/features/GoalCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const statusFilters = ['Active', 'Completed', 'All'];

const priorityOrder = { high: 1, medium: 2, low: 3 };

export default function Goals() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('Active');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(savedGoals);
  }, [location]);

  const filteredGoals = goals
    .filter(g => {
      if (activeFilter === 'All') return true;
      return g.status === activeFilter.toLowerCase();
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? Math.round((totalSavedAmount / totalTargetAmount) * 100) : 0;

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const handleUpdateGoal = (goalId: string, newAmount: number) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId ? { ...g, currentAmount: newAmount } : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-sm text-muted-foreground">Track your financial goals</p>
        </div>
        <Button 
          size="icon"
          onClick={() => navigate('/goals/add')}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Overview Card */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Total Saved</p>
            <h2 className="text-3xl font-bold mt-1">${totalSavedAmount.toLocaleString()}</h2>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary-foreground/30 flex items-center justify-center">
            <span className="text-xl font-bold">{overallProgress}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary-foreground transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-primary-foreground/80">
            ${(totalTargetAmount - totalSavedAmount).toLocaleString()} more to reach all goals
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-2">
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xl font-bold">{activeGoals.length}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-xl font-bold">{completedGoals.length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <Clock className="w-5 h-5 text-info mx-auto mb-1" />
          <p className="text-xl font-bold">{goals.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-up stagger-3">
        {statusFilters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "flex-shrink-0",
              activeFilter === filter && "shadow-card"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4 animate-fade-up stagger-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => (
            <GoalCard 
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onClick={() => navigate(`/goals/edit/${goal.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No goals found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/goals/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create a Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
