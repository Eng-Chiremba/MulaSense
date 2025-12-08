import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileBarChart, Download, Calendar, TrendingUp, TrendingDown,
  PieChart, BarChart3, ArrowRight, FileText, Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { reportAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/downloadHelper';
import { ReportsDashboard } from '@/components/features/ReportsDashboard';

const periods = ['Week', 'Month', 'Year'];

const reportTypes = [
  { 
    id: 'summary', 
    title: 'Income & Expense Summary', 
    icon: BarChart3,
    description: 'Overview of your income and expenses'
  },
  { 
    id: 'category', 
    title: 'Category Breakdown', 
    icon: PieChart,
    description: 'Spending by category analysis'
  },
  { 
    id: 'cashflow', 
    title: 'Cash Flow', 
    icon: FileBarChart,
    description: 'Money movement analysis'
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'year'>('month');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, [activePeriod]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, metricsRes] = await Promise.all([
        reportAPI.getDashboard(),
        reportAPI.getMetrics(activePeriod)
      ]);
      setDashboardData(dashboardRes.data);
      setMetricsData(metricsRes.data);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'csv' | 'pdf' | 'excel') => {
    try {
      let response;
      let filename;
      
      if (type === 'csv') {
        response = await reportAPI.exportTransactionsCSV();
        filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'pdf') {
        response = await reportAPI.exportReportPDF();
        filename = `financial_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else {
        response = await reportAPI.exportBalanceSheetExcel();
        filename = `balance_sheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      }
      
      downloadFile(new Blob([response.data]), filename);
      
      toast({
        title: 'Success',
        description: `${type.toUpperCase()} report exported successfully`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  if (loading || !dashboardData) {
    return <div className="p-4 text-center">Loading reports...</div>;
  }

  const { financial_summary, budget_performance } = dashboardData;
  const totalIncome = financial_summary?.monthly_income || 0;
  const totalExpenses = financial_summary?.monthly_expenses || 0;
  const netBalance = financial_summary?.balance || 0;
  const savingsRate = financial_summary?.savings_rate || 0;

  const categoryData = metricsData?.expense_categories?.map((cat: any) => ({
    name: cat.category__name,
    amount: cat.total,
    color: cat.category__color || '#2D358B',
    percentage: totalExpenses > 0 ? Math.round((cat.total / totalExpenses) * 100) : 0
  })) || [];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">Financial analytics & insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleExport('csv')} title="Export CSV">
            <Table className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleExport('pdf')} title="Export PDF">
            <FileText className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleExport('excel')} title="Export Excel">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 animate-fade-up stagger-1">
        {(['week', 'month', 'year'] as const).map((period) => (
          <Button
            key={period}
            variant={activePeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePeriod(period)}
            className={cn(
              "flex-1 capitalize",
              activePeriod === period && "shadow-card"
            )}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground animate-fade-up stagger-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Net Balance</p>
            <h2 className="text-3xl font-bold mt-1">${netBalance.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm font-medium">Savings Rate</p>
            <p className="text-2xl font-bold">{savingsRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-primary-foreground/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Income</span>
            </div>
            <p className="text-xl font-bold">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-foreground/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Expenses</span>
            </div>
            <p className="text-xl font-bold">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4 animate-fade-up stagger-3">
        <h3 className="font-semibold">Top Spending Categories</h3>
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4 space-y-4">
          {categoryData.slice(0, 4).map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-muted-foreground">
                  ${category.amount.toLocaleString()} ({category.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Insights */}
      <div className="animate-fade-up stagger-4">
        <ReportsDashboard dashboardData={dashboardData} />
      </div>

      {/* Report Types */}
      <div className="space-y-3 animate-fade-up stagger-5">
        <h3 className="font-semibold">Available Reports</h3>
        <div className="grid gap-3">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => {
                if (report.id === 'summary') navigate('/reports/income-expense');
                if (report.id === 'category') navigate('/reports/category-breakdown');
                if (report.id === 'cashflow') navigate('/reports/cashflow');
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50 text-left hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <report.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
