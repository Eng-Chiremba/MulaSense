import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowUpCircle, ArrowDownCircle, Wallet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactionAPI } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { exportToExcel } from '@/lib/excelExport';
import { toast } from '@/hooks/use-toast';

export default function CashFlowReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalInflow: 0, totalOutflow: 0, netCashFlow: 0, endingBalance: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = cashFlowData.map(data => ({
      Month: data.month,
      'Cash Inflow': data.Inflow,
      'Cash Outflow': data.Outflow,
      'Net Cash Flow': data.NetFlow,
      'Ending Balance': data.Balance
    }));
    
    exportToExcel(exportData, 'cash_flow_report');
    toast({
      title: 'Success',
      description: 'Report exported successfully',
    });
  };

  const fetchData = async () => {
    try {
      const response = await transactionAPI.getAll();
      const transactions = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      const monthly: Record<string, { inflow: number; outflow: number }> = {};
      let totalIn = 0, totalOut = 0;
      
      transactions.forEach((txn: any) => {
        if (txn.status !== 'completed') return;
        const monthKey = format(new Date(txn.transaction_date), 'MMM yyyy');
        if (!monthly[monthKey]) monthly[monthKey] = { inflow: 0, outflow: 0 };
        
        const amount = parseFloat(txn.amount);
        if (txn.transaction_type === 'income') {
          monthly[monthKey].inflow += amount;
          totalIn += amount;
        } else if (txn.transaction_type === 'expense') {
          monthly[monthKey].outflow += amount;
          totalOut += amount;
        }
      });
      
      let runningBalance = 0;
      const chartData = Object.entries(monthly)
        .map(([month, data]) => {
          const netFlow = data.inflow - data.outflow;
          runningBalance += netFlow;
          return {
            month,
            Inflow: Math.round(data.inflow),
            Outflow: Math.round(data.outflow),
            NetFlow: Math.round(netFlow),
            Balance: Math.round(runningBalance),
          };
        })
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6);
      
      setCashFlowData(chartData);
      setSummary({
        totalInflow: Math.round(totalIn),
        totalOutflow: Math.round(totalOut),
        netCashFlow: Math.round(totalIn - totalOut),
        endingBalance: chartData.length > 0 ? chartData[chartData.length - 1].Balance : 0,
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
          <div className="flex-1">
            <h1 className="text-xl font-bold">Cash Flow Analysis</h1>
            <p className="text-xs text-muted-foreground">Money movement tracking</p>
          </div>
          {cashFlowData.length > 0 && (
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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-[#2D358B] to-[#1e2460] rounded-2xl p-4 text-white">
                <ArrowUpCircle className="w-5 h-5 mb-2 opacity-90" />
                <p className="text-xs opacity-90">Cash Inflow</p>
                <p className="text-2xl font-bold mt-1">${summary.totalInflow.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-[#2D358B] to-[#1e2460] rounded-2xl p-4 text-white">
                <ArrowDownCircle className="w-5 h-5 mb-2 opacity-90" />
                <p className="text-xs opacity-90">Cash Outflow</p>
                <p className="text-2xl font-bold mt-1">${summary.totalOutflow.toLocaleString()}</p>
              </div>
            </div>

            {/* Net Cash Flow Card */}
            <div className={`rounded-2xl p-5 text-white ${
              summary.netCashFlow >= 0 
                ? 'bg-gradient-to-br from-[#2D358B] to-[#1e2460]' 
                : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5" />
                    <p className="text-sm opacity-90">Net Cash Flow</p>
                  </div>
                  <p className="text-3xl font-bold">${Math.abs(summary.netCashFlow).toLocaleString()}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {summary.netCashFlow >= 0 ? 'Positive' : 'Negative'} flow
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Ending Balance</p>
                  <p className="text-3xl font-bold">${Math.abs(summary.endingBalance).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Cash Balance Trend */}
            {cashFlowData.length > 0 && (
              <>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Cash Balance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D358B" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2D358B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Balance" stroke="#2D358B" fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Inflow vs Outflow */}
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                  <h3 className="font-semibold mb-4">Cash Flow Movement</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cashFlowData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Inflow" stroke="#2D358B" strokeWidth={3} />
                      <Line type="monotone" dataKey="Outflow" stroke="#2D358B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Cash Flow */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Monthly Cash Flow Statement</h3>
                  {cashFlowData.map((data) => (
                    <div key={data.month} className="bg-card rounded-xl shadow-card border border-border/50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{data.month}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          data.NetFlow >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {data.NetFlow >= 0 ? 'Positive' : 'Negative'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cash Inflow</span>
                          <span className="font-semibold" style={{ color: '#2D358B' }}>+${data.Inflow.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cash Outflow</span>
                          <span className="font-semibold" style={{ color: '#2D358B' }}>-${data.Outflow.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-medium">Net Cash Flow</span>
                          <span className={`font-bold ${data.NetFlow >= 0 ? '' : 'text-red-600'}`} style={data.NetFlow >= 0 ? { color: '#2D358B' } : {}}>
                            {data.NetFlow >= 0 ? '+' : '-'}${Math.abs(data.NetFlow).toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-medium">Ending Balance</span>
                          <span className="font-bold" style={{ color: '#2D358B' }}>${data.Balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
