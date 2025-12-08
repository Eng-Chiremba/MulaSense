import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Trash2, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { debtorAPI } from '@/services/api';
import { generateWhatsAppLink } from '@/lib/whatsappHelper';

interface Debtor {
  id: number;
  name: string;
  phone_number: string;
  amount_owed: number;
  due_date: string;
}

export default function DebtBook() {
  const navigate = useNavigate();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebtors();
  }, []);

  const fetchDebtors = async () => {
    try {
      const [debtorsRes, totalRes] = await Promise.all([
        debtorAPI.getAll(),
        debtorAPI.getTotalOwed(),
      ]);
      setDebtors(debtorsRes.data);
      setTotalOwed(totalRes.data.total_owed);
    } catch (error) {
      console.error('Failed to fetch debtors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettleDebt = async (debtorId: number) => {
    try {
      await debtorAPI.settleDebt(debtorId);
      fetchDebtors();
    } catch (error) {
      console.error('Failed to settle debt:', error);
    }
  };

  if (loading) {
    return <div className="p-4"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Debt Book</h1>
        </div>
        <Button onClick={() => navigate('/debtors/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Debtor
        </Button>
      </div>

      <Card className="p-5 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #2D358B 0%, #1e2460 100%)' }}>
        <p className="text-sm opacity-90">Total Owed to Me</p>
        <p className="text-3xl font-bold mt-1">${totalOwed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        <p className="text-xs opacity-75 mt-1">{debtors.length} debtor(s)</p>
      </Card>

      <div className="space-y-3">
        {debtors.length > 0 ? (
          debtors.map((debtor) => (
            <Card key={debtor.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{debtor.name}</p>
                  <p className="text-sm text-muted-foreground">{debtor.phone_number}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {new Date(debtor.due_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-lg font-bold text-primary">${debtor.amount_owed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => window.open(generateWhatsAppLink({ name: debtor.name, phone_number: debtor.phone_number, amount_remaining: debtor.amount_owed, due_date: debtor.due_date }), '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleSettleDebt(debtor.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No debtors yet</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/debtors/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Debtor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
