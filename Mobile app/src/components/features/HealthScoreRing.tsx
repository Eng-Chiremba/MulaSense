import { cn } from '@/lib/utils';

interface HealthScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HealthScoreRing({ score, size = 'md', className }: HealthScoreRingProps) {
  const radius = size === 'sm' ? 35 : size === 'md' ? 50 : 65;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const viewBoxSize = (radius + strokeWidth) * 2;
  
  const getColor = () => {
    if (score >= 80) return 'hsl(var(--success))';
    if (score >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };
  
  const getLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "font-bold",
            size === 'sm' ? "text-lg" : size === 'md' ? "text-2xl" : "text-3xl"
          )}>
            {score}%
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground font-medium">
              Health Score
            </span>
          )}
        </div>
      </div>
      <span 
        className={cn(
          "mt-2 font-semibold text-sm",
          score >= 80 && "text-success",
          score >= 60 && score < 80 && "text-warning",
          score < 60 && "text-destructive"
        )}
      >
        {getLabel()}
      </span>
    </div>
  );
}
