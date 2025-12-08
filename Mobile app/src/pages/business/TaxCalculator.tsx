import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calculator, RefreshCw, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEstimatedTaxBill } from '@/lib/zimbabweTaxCalculator';
import { businessAPI } from '@/services/api';
import { TaxBreakdown } from '@/lib/taxCalculator';
import { calculatePAYE } from '@/lib/payeCalculator';
import { useDateRange } from '@/hooks/useDateRange';

interface DashboardData {
  financial_summary: {
    monthly_income: number;
    monthly_expenses: number;
    net_savings: number;
  };
}

interface PAYEResult {
  gross: number;
  nssa: number;
  taxableIncome: number;
  paye: number;
  aidsLevy: number;
  netPay: number;
}

export default function TaxCalculator() {
  const navigate = useNavigate();
  const { startDate, setStartDate, endDate, setEndDate } = useDateRange();
  const [netProfit, setNetProfit] = useState(0);
  const [annualRevenue, setAnnualRevenue] = useState(0);
  const [grossSalary, setGrossSalary] = useState(0);
  const [taxBill, setTaxBill] = useState<TaxBreakdown | null>(null);
  const [payeResult, setPayeResult] = useState<PAYEResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        const res = await businessAPI.getMetrics();
        const data: DashboardData = res.data;
        const profit = data.financial_summary.net_savings ?? 0;
        const revenue = (data.financial_summary.monthly_income ?? 0) * 12;
        
        setNetProfit(profit);
        setAnnualRevenue(revenue);
        
        const bill = getEstimatedTaxBill({
          netProfit: profit,
          annualRevenue: revenue,
          grossSalary: 0,
        });
        setTaxBill(bill);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, [startDate, endDate]);

  const handleRecalculate = () => {
    const bill = getEstimatedTaxBill({
      netProfit,
      annualRevenue,
      grossSalary,
    });
    setTaxBill(bill);
    
    if (grossSalary > 0) {
      const paye = calculatePAYE(grossSalary);
      setPayeResult(paye);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Tax Calculator</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRecalculate}>
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Net Profit ($)</label>
          <Input
            type="number"
            value={netProfit}
            onChange={(e) => setNetProfit(Number(e.target.value))}
            placeholder="0"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Annual Revenue ($)</label>
          <Input
            type="number"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(Number(e.target.value))}
            placeholder="0"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Gross Salary ($)</label>
          <Input
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(Number(e.target.value))}
            placeholder="0"
            className="mt-2"
          />
        </div>

        <Button onClick={handleRecalculate} className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Recalculate Tax
        </Button>
      </Card>

      {payeResult && (
        <div className="space-y-3">
          <h3 className="font-semibold">PAYE Calculation (2025 Zimbabwe)</h3>
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-sm text-muted-foreground">Net Pay</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              ${payeResult.netPay.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Gross Salary</p>
              <p className="text-lg font-semibold mt-1">
                ${payeResult.gross.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">NSSA Deduction</p>
              <p className="text-lg font-semibold mt-1">
                ${payeResult.nssa.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Taxable Income</p>
              <p className="text-lg font-semibold mt-1">
                ${payeResult.taxableIncome.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">PAYE Tax</p>
              <p className="text-lg font-semibold mt-1">
                ${payeResult.paye.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">AIDS Levy (3%)</p>
              <p className="text-lg font-semibold mt-1">
                ${payeResult.aidsLevy.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>
          </div>
        </div>
      )}

      {taxBill && (
        <div className="space-y-3">
          <h3 className="font-semibold">Business Tax Summary</h3>
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-sm text-muted-foreground">Total Tax Liability ({startDate} to {endDate})</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              ${taxBill.totalTax.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Corporate Tax</p>
              <p className="text-lg font-semibold mt-1">
                ${taxBill.corporateTax.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">AIDS Levy</p>
              <p className="text-lg font-semibold mt-1">
                ${taxBill.aidsLevy.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">VAT</p>
              <p className="text-lg font-semibold mt-1">
                ${taxBill.vat.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {taxBill.vatRegistered ? 'Registered' : 'Not Registered'}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">PAYE</p>
              <p className="text-lg font-semibold mt-1">
                ${taxBill.paye.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </Card>
          </div>

          <Card className="p-4 bg-amber-50">
            <p className="text-sm font-medium">Effective Corporate Rate</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{taxBill.effectiveCorporateRate}%</p>
          </Card>
        </div>
      )}
    </div>
  );
}
