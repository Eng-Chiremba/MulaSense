import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart as PieChartIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactionAPI } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { exportToExcel } from '@/lib/excelExport';
import { toast } from '@/hooks/use-toast';

export default function IncomeExpenseReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, avgIncome: 0, avgExpenses: 0 });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  const COLORS = ['#2D358B', '#3B82F6', '#765a2bff', '#4b357fff', '#762950ff', '#2b6961ff', '#070504ff', '#383976ff'];

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = chartData.map(data => ({
      Month: data.month,
      Income: data.Income,
      Expenses: data.Expenses,
      Net: data.Income - data.Expenses,
      'Savings Rate': `${data.Income > 0 ? ((data.Income - data.Expenses) / data.Income * 100).toFixed(1) : 0}%`
    }));
    
    exportToExcel(exportData, 'income_expense_report');
    toast({
      title: 'Success',
      description: 'Report exported successfully',
    });
  };

  const fetchData = async () => {
    try {
      const response = await transactionAPI.getAll();
      const transactions = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      const monthlyData: Record<string, { income: number; expense: number }> = {};
      const categoryTotals: Record<string, number> = {};
      let totalIncome = 0, totalExpenses = 0;
      
      transactions.forEach((txn: any) => {
        if (txn.status !== 'completed') return;
        
        const date = new Date(txn.transaction_date);
        const monthKey = format(date, 'MMM yyyy');
        const amount = parseFloat(txn.amount);
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 };
        }
        
        if (txn.transaction_type === 'income') {
          monthlyData[monthKey].income += amount;
          totalIncome += amount;
        } else if (txn.transaction_type === 'expense') {
          monthlyData[monthKey].expense += amount;
          totalExpenses += amount;
          const category = txn.category_name || 'Other';
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });
      
      const sortedData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          Income: Math.round(data.income),
          Expenses: Math.round(data.expense),
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6);
      
      const categoryChartData = Object.entries(categoryTotals)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      
      setChartData(sortedData);
      setCategoryData(categoryChartData);
      setSummary({
        totalIncome: Math.round(totalIncome),
        totalExpenses: Math.round(totalExpenses),
        avgIncome: sortedData.length ? Math.round(totalIncome / sortedData.length) : 0,
        avgExpenses: sortedData.length ? Math.round(totalExpenses / sortedData.length) : 0,
      });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Income & Expense Summary</h1>
            <p className="text-xs text-muted-foreground">Monthly breakdown</p>
          </div>
          {chartData.length > 0 && (
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : chartData.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-[#2D358B] to-[#1e2460] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-xs opacity-90">Total Income</p>
                </div>
                <p className="text-2xl font-bold">${summary.totalIncome.toLocaleString()}</p>
                <p className="text-xs opacity-75 mt-1">Avg: ${summary.avgIncome.toLocaleString()}/mo</p>
              </div>
              <div className="bg-gradient-to-br from-[#89221f] to-[#6b1a17] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <p className="text-xs opacity-90">Total Expenses</p>
                </div>
                <p className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
                <p className="text-xs opacity-75 mt-1">Avg: ${summary.avgExpenses.toLocaleString()}/mo</p>
              </div>
            </div>

            {/* Net Balance Card */}
            <div className={`rounded-2xl p-5 text-white ${
              summary.totalIncome - summary.totalExpenses >= 0 
                ? 'bg-gradient-to-br from-[#2D358B] to-[#1e2460]' 
                : 'bg-gradient-to-br from-[#89221f] to-[#6b1a17]'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <p className="text-sm opacity-90">Net Balance</p>
                  </div>
                  <p className="text-3xl font-bold">
                    ${Math.abs(summary.totalIncome - summary.totalExpenses).toLocaleString()}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {summary.totalIncome > 0 
                      ? `${Math.round((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100)}% savings rate`
                      : 'No income recorded'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Last 6 months</p>
                  <Calendar className="w-8 h-8 opacity-50 mt-2" />
                </div>
              </div>
            </div>

            {/* Chart Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="flex-1"
              >
                Bar Chart
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
                className="flex-1"
              >
                Line Chart
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
                className="flex-1"
              >
                Pie Chart
              </Button>
            </div>

            {/* Charts */}
            {chartType !== 'pie' && (
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                <h3 className="font-semibold mb-4">Income vs Expenses Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Income" fill="#2D358B" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#89221f" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Income" stroke="#2D358B" strokeWidth={3} />
                      <Line type="monotone" dataKey="Expenses" stroke="#89221f" strokeWidth={3} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Breakdown Pie Chart */}
            {chartType === 'pie' && categoryData.length > 0 && (
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                <h3 className="font-semibold mb-4">Expense Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryData.map((cat, idx) => (
                    <div key={cat.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-xs">{cat.name}: ${cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Monthly Breakdown</h3>
              {chartData.map((data) => {
                const net = data.Income - data.Expenses;
                const savingsRate = data.Income > 0 ? (net / data.Income * 100) : 0;
                return (
                  <div key={data.month} className="bg-card rounded-xl shadow-card border border-border/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium">{data.month}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        net >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {net >= 0 ? 'Surplus' : 'Deficit'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="text-lg font-bold" style={{ color: '#2D358B' }}>${data.Income.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="text-lg font-bold" style={{ color: '#89221f' }}>${data.Expenses.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Net</p>
                        <p className="text-lg font-bold" style={{ color: net >= 0 ? '#2D358B' : '#89221f' }}>
                          ${Math.abs(net).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Savings Rate</p>
                        <p className="text-lg font-bold" style={{ color: '#2D358B' }}>{savingsRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <PieChartIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No transaction data available</p>
            <p className="text-sm text-muted-foreground mt-2">Add some transactions to see your summary</p>
          </div>
        )}
      </div>
    </div>
  );
}
