import { FileText, Calculator, TrendingUp, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BusinessReports() {
  const navigate = useNavigate();

  const reports = [
    {
      title: 'Income & Expense Summary',
      description: 'Overview of income and expenses',
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
      path: '/reports/income-expense',
    },
    {
      title: 'Category Breakdown',
      description: 'Spending by category analysis',
      icon: FileText,
      color: 'bg-primary/10 text-primary',
      path: '/reports/category-breakdown',
    },
    {
      title: 'Cash Flow',
      description: 'Money movement analysis',
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
      path: '/reports/cashflow',
    },
    {
      title: 'Profit & Loss',
      description: 'Revenue and expense breakdown',
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
      path: '/reports/profit-loss',
    },
    {
      title: 'Tax Calculator',
      description: 'ZIMRA tax compliance',
      icon: Calculator,
      color: 'bg-warning/10 text-warning',
      path: '/business/tax',
    },
    {
      title: 'Credit Line',
      description: 'Business credit application',
      icon: CreditCard,
      color: 'bg-success/10 text-success',
      path: '/business/credit',
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Reports</h1>
        <p className="text-muted-foreground text-sm">Financial statements and tools</p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.path}
            onClick={() => navigate(report.path)}
            className="w-full p-4 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
