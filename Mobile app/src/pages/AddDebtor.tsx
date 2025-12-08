import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { debtorAPI } from '@/services/api';

export default function AddDebtor() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !amount || !dueDate) return;
    
    setLoading(true);
    try {
      await debtorAPI.create({
        name,
        phone_number: phone,
        amount_owed: parseFloat(amount),
        due_date: dueDate,
      });
      navigate('/debt-book');
    } catch (error) {
      console.error('Failed to add debtor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add Debtor</h1>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Debtor name"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Amount Owed ($)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Debtor'}
        </Button>
      </Card>
    </div>
  );
}
