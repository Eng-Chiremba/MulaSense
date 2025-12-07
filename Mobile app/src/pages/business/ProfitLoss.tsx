import { FileText, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProfitLoss } from '@/data/businessMockData';

export default function ProfitLoss() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profit & Loss</h1>
          <p className="text-muted-foreground text-sm">{mockProfitLoss.period}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">Net Profit</p>
            <h2 className="text-3xl font-bold mt-1">${mockProfitLoss.netProfit.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm">Margin</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold">{mockProfitLoss.profitMargin}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">Revenue</h3>
            <span className="font-bold text-primary">${mockProfitLoss.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="space-y-3">
            {mockProfitLoss.revenue.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.category}</span>
                <span className="font-medium">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-destructive">Expenses</h3>
            <span className="font-bold text-destructive">${mockProfitLoss.totalExpenses.toLocaleString()}</span>
          </div>
          <div className="space-y-3">
            {mockProfitLoss.expenses.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.category}</span>
                <span className="font-medium">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
