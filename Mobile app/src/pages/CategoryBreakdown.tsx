import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactionAPI } from '@/services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { exportToExcel } from '@/lib/excelExport';
import { toast } from '@/hooks/use-toast';

const COLORS = ['#2D358B', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4'];

export default function CategoryBreakdown() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [viewType, setViewType] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = currentData.map(cat => ({
      Category: cat.name,
      Amount: cat.value,
      Percentage: `${cat.percentage}%`
    }));
    
    exportToExcel(exportData, `${viewType}_category_breakdown`);
    toast({
      title: 'Success',
      description: 'Report exported successfully',
    });
  };

  const fetchData = async () => {
    try {
      const response = await transactionAPI.getAll();
      const transactions = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      const expenseCats: Record<string, number> = {};
      const incomeCats: Record<string, number> = {};
      let expTotal = 0, incTotal = 0;
      
      transactions.forEach((txn: any) => {
        if (txn.status !== 'completed') return;
        const amount = parseFloat(txn.amount);
        const category = txn.category_name || 'Other';
        
        if (txn.transaction_type === 'expense') {
          expenseCats[category] = (expenseCats[category] || 0) + amount;
          expTotal += amount;
        } else if (txn.transaction_type === 'income') {
          incomeCats[category] = (incomeCats[category] || 0) + amount;
          incTotal += amount;
        }
      });
      
      const expenseChartData = Object.entries(expenseCats)
        .map(([name, value]) => ({ name, value: Math.round(value), percentage: expTotal > 0 ? (value / expTotal * 100).toFixed(1) : 0 }))
        .sort((a, b) => b.value - a.value);
      
      const incomeChartData = Object.entries(incomeCats)
        .map(([name, value]) => ({ name, value: Math.round(value), percentage: incTotal > 0 ? (value / incTotal * 100).toFixed(1) : 0 }))
        .sort((a, b) => b.value - a.value);
      
      setExpenseData(expenseChartData);
      setIncomeData(incomeChartData);
      setTotalExpenses(Math.round(expTotal));
      setTotalIncome(Math.round(incTotal));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = viewType === 'expense' ? expenseData : incomeData;
  const currentTotal = viewType === 'expense' ? totalExpenses : totalIncome;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Category Breakdown</h1>
            <p className="text-xs text-muted-foreground">Spending analysis by category</p>
          </div>
          {currentData.length > 0 && (
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
        ) : (
          <>
            {/* Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewType === 'expense' ? 'default' : 'outline'}
                onClick={() => setViewType('expense')}
                className="flex-1"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Expenses
              </Button>
              <Button
                variant={viewType === 'income' ? 'default' : 'outline'}
                onClick={() => setViewType('income')}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Income
              </Button>
            </div>

            {/* Total Card */}
            <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#2D358B] to-[#1e2460]">
              <p className="text-sm opacity-90 mb-2">Total {viewType === 'expense' ? 'Expenses' : 'Income'}</p>
              <p className="text-4xl font-bold">${currentTotal.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-2">{currentData.length} categories</p>
            </div>

            {currentData.length > 0 ? (
              <>
                {/* Pie Chart */}
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={currentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {currentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={currentData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2D358B" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Category List */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Detailed Breakdown</h3>
                  {currentData.map((cat, idx) => (
                    <div key={cat.name} className="bg-card rounded-xl shadow-card border border-border/50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">{cat.percentage}%</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${cat.percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={viewType === 'expense' ? 'text-red-600' : 'text-green-600'}>
                            ${cat.value.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            {currentTotal > 0 ? `${((cat.value / currentTotal) * 100).toFixed(1)}% of total` : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No {viewType} data available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
