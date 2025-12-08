import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactionAPI } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';

export default function ProfitLossReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await transactionAPI.getAll();
      const transactions = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      const monthly: Record<string, { revenue: number; expenses: number }> = {};
      let totalRev = 0, totalExp = 0;
      
      transactions.forEach((txn: any) => {
        if (txn.status !== 'completed') return;
        const monthKey = format(new Date(txn.transaction_date), 'MMM yyyy');
        if (!monthly[monthKey]) monthly[monthKey] = { revenue: 0, expenses: 0 };
        
        const amount = parseFloat(txn.amount);
        if (txn.transaction_type === 'income') {
          monthly[monthKey].revenue += amount;
          totalRev += amount;
        } else if (txn.transaction_type === 'expense') {
          monthly[monthKey].expenses += amount;
          totalExp += amount;
        }
      });
      
      const chartData = Object.entries(monthly)
        .map(([month, data]) => ({
          month,
          Revenue: Math.round(data.revenue),
          Expenses: Math.round(data.expenses),
          Profit: Math.round(data.revenue - data.expenses),
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6);
      
      const netProfit = totalRev - totalExp;
      setMonthlyData(chartData);
      setSummary({
        totalRevenue: Math.round(totalRev),
        totalExpenses: Math.round(totalExp),
        netProfit: Math.round(netProfit),
        profitMargin: totalRev > 0 ? Math.round((netProfit / totalRev) * 100) : 0,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
          <div>
            <h1 className="text-xl font-bold">Profit & Loss</h1>
            <p className="text-xs text-muted-foreground">Financial performance analysis</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
                <TrendingUp className="w-5 h-5 mb-2 opacity-90" />
                <p className="text-xs opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">${summary.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white">
                <TrendingDown className="w-5 h-5 mb-2 opacity-90" />
                <p className="text-xs opacity-90">Total Expenses</p>
                <p className="text-2xl font-bold mt-1">${summary.totalExpenses.toLocaleString()}</p>
              </div>
            </div>

            {/* Net Profit Card */}
            <div className={`rounded-2xl p-5 text-white ${
              summary.netProfit >= 0 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : 'bg-gradient-to-br from-orange-500 to-orange-600'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <p className="text-sm opacity-90">Net Profit</p>
                  </div>
                  <p className="text-3xl font-bold">${Math.abs(summary.netProfit).toLocaleString()}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {summary.netProfit >= 0 ? 'Profit' : 'Loss'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Profit Margin</p>
                  <p className="text-3xl font-bold">{summary.profitMargin}%</p>
                </div>
              </div>
            </div>

            {/* Profit Trend Chart */}
            {monthlyData.length > 0 && (
              <>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Profit Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Profit" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue vs Expenses */}
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Monthly P&L Statement</h3>
                  {monthlyData.map((data) => {
                    const profitMargin = data.Revenue > 0 ? ((data.Profit / data.Revenue) * 100).toFixed(1) : 0;
                    return (
                      <div key={data.month} className="bg-card rounded-xl shadow-card border border-border/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium">{data.month}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            data.Profit >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {profitMargin}% margin
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Revenue</span>
                            <span className="font-semibold text-green-600">${data.Revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Expenses</span>
                            <span className="font-semibold text-red-600">${data.Expenses.toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t flex justify-between">
                            <span className="font-medium">Net Profit</span>
                            <span className={`font-bold ${data.Profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                              ${Math.abs(data.Profit).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
