import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DebtorDetail {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  percentage_paid: number;
  due_date: string;
  status: string;
  items: any[];
  payments: any[];
}

export default function DebtorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debtor, setDebtor] = useState<DebtorDetail | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebtor();
  }, [id]);

  const fetchDebtor = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setDebtor(data);
    } catch (error) {
      console.error('Failed to fetch debtor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || !debtor) return;

    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          payment_date: paymentDate,
          payment_method: 'cash'
        })
      });

      if (res.ok) {
        setPaymentAmount('');
        fetchDebtor();
      }
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!debtor) return <div className="p-4">Debtor not found</div>;

  const daysRemaining = Math.ceil((new Date(debtor.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{debtor.name}</h1>
          <p className="text-gray-600">{debtor.phone}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          debtor.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {debtor.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">${debtor.total_amount}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-gray-600">Amount Paid</p>
          <p className="text-2xl font-bold text-green-600">${debtor.amount_paid}</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <p className="text-sm text-gray-600">Due Date</p>
        <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
          {new Date(debtor.due_date).toLocaleDateString()}
        </p>
        <p className={`text-sm mt-1 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
          {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days remaining`}
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${debtor.percentage_paid}%` }}></div>
        </div>
        <p className="text-sm font-semibold">{debtor.percentage_paid.toFixed(1)}% Complete</p>
        <p className="text-sm text-gray-600 mt-1">Remaining: ${debtor.amount_remaining}</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Record Payment</h3>
        <form onSubmit={handlePayment} className="space-y-3">
          <Input
            type="number"
            placeholder="Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            step="0.01"
            required
          />
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Record Payment</Button>
        </form>
      </div>

      {debtor.payments.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Payment History</h3>
          <div className="space-y-2">
            {debtor.payments.map((payment) => (
              <div key={payment.id} className="p-3 rounded border border-gray-200 flex justify-between">
                <div>
                  <p className="font-medium">${payment.amount}</p>
                  <p className="text-sm text-gray-600">{payment.payment_date}</p>
                </div>
                <p className="text-sm text-gray-600">{payment.payment_method}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {debtor.items.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Items Sold</h3>
          <div className="space-y-2">
            {debtor.items.map((item) => (
              <div key={item.id} className="p-3 rounded border border-gray-200">
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-600">{item.quantity} x ${item.unit_price} = ${item.total_price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button variant="outline" onClick={() => navigate('/debt-book')} className="w-full">
        Back to Debt Book
      </Button>
    </div>
  );
}
