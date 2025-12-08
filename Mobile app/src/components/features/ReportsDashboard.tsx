import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportsDashboardProps {
  dashboardData: any;
  className?: string;
}

export function ReportsDashboard({ dashboardData, className }: ReportsDashboardProps) {
  const { budget_performance, goals_summary, recent_activity } = dashboardData;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Budget Performance */}
      {budget_performance && (
        <div className="space-y-3">
          <h3 className="font-semibold">Budget Performance</h3>
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold">{budget_performance.total_categories}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Over Budget</p>
                <p className={cn(
                  "text-2xl font-bold",
                  budget_performance.over_budget > 0 ? "text-destructive" : "text-success"
                )}>
                  {budget_performance.over_budget}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {budget_performance.categories?.map((cat: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {cat.status === 'over' ? (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    cat.percentage_used > 100 ? "text-destructive" : "text-success"
                  )}>
                    {cat.percentage_used.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goals Summary */}
      {goals_summary && goals_summary.total_goals > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Goals Progress</h3>
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{goals_summary.total_goals}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-success">{goals_summary.on_track}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {goals_summary.goals?.map((goal: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {goal.days_remaining} days left
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {goal.progress.toFixed(1)}% complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recent_activity && recent_activity.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Recent Activity</h3>
          <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
            {recent_activity.map((activity: any, idx: number) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    activity.type === 'income' ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    {activity.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.category} • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={cn(
                  "font-semibold",
                  activity.type === 'income' ? "text-success" : "text-destructive"
                )}>
                  {activity.type === 'income' ? '+' : '-'}${activity.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
