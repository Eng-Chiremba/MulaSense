import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

export default function Kashagi() {
  const [healthScore, setHealthScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [loans, setLoans] = useState<any[]>([]);

  useEffect(() => {
    fetchHealthScore();
    fetchLoans();
  }, []);

  const fetchHealthScore = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/budget/loan/health-score/', {
        headers: { Authorization: `Token ${token}` }
      });
      setHealthScore(response.data);
    } catch (error) {
      console.error('Failed to fetch health score:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/budget/loan/applications/', {
        headers: { Authorization: `Token ${token}` }
      });
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

  const handleApply = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }

    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/budget/loan/apply/', {
        amount: parseFloat(loanAmount),
        duration_months: parseInt(duration)
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      toast({
        title: response.data.status === 'approved' ? 'Loan Approved!' : 'Loan Rejected',
        description: response.data.status === 'approved' 
          ? `Your loan of $${response.data.amount_approved} has been approved!`
          : 'Your loan application was rejected. Improve your financial health score and try again.',
        variant: response.data.status === 'approved' ? 'default' : 'destructive'
      });

      setLoanAmount('');
      fetchLoans();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to apply for loan', variant: 'destructive' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Kashagi (Loan)</h1>
        <p className="text-sm text-muted-foreground">Get instant loans based on your financial health</p>
      </div>

      {/* Financial Health Score */}
      <Card className="p-6 gradient-hero text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Financial Health Score</p>
            <h2 className="text-4xl font-bold mt-1">{healthScore?.score || 0}</h2>
            <p className="text-sm mt-1">{healthScore?.rating || 'N/A'}</p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Income Stability</span>
            <span>{healthScore?.breakdown?.income_stability}/20</span>
          </div>
          <div className="flex justify-between">
            <span>Expense Ratio</span>
            <span>{healthScore?.breakdown?.expense_ratio}/25</span>
          </div>
          <div className="flex justify-between">
            <span>Savings Rate</span>
            <span>{healthScore?.breakdown?.savings_rate}/25</span>
          </div>
          <div className="flex justify-between">
            <span>Budget Adherence</span>
            <span>{healthScore?.breakdown?.budget_adherence}/20</span>
          </div>
        </div>
      </Card>

      {/* Loan Limit */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Loan Limit</p>
            <p className="text-2xl font-bold text-primary">${healthScore?.loan_limit?.toLocaleString() || 0}</p>
          </div>
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
      </Card>

      {/* Apply for Loan */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Apply for Kashagi</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Loan Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (Months)</Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="18">18 months</option>
              <option value="24">24 months</option>
            </select>
          </div>
          <Button onClick={handleApply} disabled={applying} className="w-full">
            {applying ? 'Processing...' : 'Apply Now'}
          </Button>
        </div>
      </Card>

      {/* Loan History */}
      {loans.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Your Loans</h3>
          {loans.map((loan) => (
            <Card key={loan.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">${loan.amount_requested.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{loan.duration_months} months @ {loan.interest_rate}%</p>
                  {loan.monthly_payment && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly: ${loan.monthly_payment.toFixed(2)}
                    </p>
                  )}
                </div>
                <Badge variant={loan.status === 'approved' ? 'default' : loan.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {loan.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {loan.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                  {loan.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
