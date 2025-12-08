import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function RecordPayment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [debtorName, setDebtorName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDebtor();
    }
  }, [id]);

  const fetchDebtor = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setDebtorName(data.name);
    } catch (error) {
      console.error('Failed to fetch debtor:', error);
      toast({
        title: 'Error',
        description: 'Failed to load debtor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      amount: parseFloat(amount),
      payment_date: paymentDate,
      payment_method: paymentMethod,
      notes
    };

    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Response text:', text);
        throw new Error('Invalid response from server');
      }

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Payment recorded successfully',
        });
        navigate('/debt-book');
      } else {
        toast({
          title: 'Error',
          description: data?.error || data?.detail || 'Failed to record payment',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Record Payment</h1>
      <p className="text-sm text-muted-foreground">From: {debtorName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0.00"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Date</label>
          <Input 
            type="date" 
            value={paymentDate} 
            onChange={(e) => setPaymentDate(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="check">Check</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this payment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'Recording...' : 'Record Payment'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/debt-book')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
