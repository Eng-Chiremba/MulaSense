import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { transactionAPI } from '@/services/api';
import { ussdService } from '@/services/ussd.service';
import axios from 'axios';

interface EcocashDialogProps {
  onClose: () => void;
}

type ServiceType = 'pay_service' | 'send_money' | 'buy_airtime' | null;

export function EcocashDialog({ onClose }: EcocashDialogProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [currency, setCurrency] = useState<'USD' | 'ZIG'>('USD');
  const [amount, setAmount] = useState('');
  const [agentCode, setAgentCode] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const executeUSSD = async (ussdCode: string, description: string) => {
    setLoading(true);
    try {
      const result = await ussdService.executeUSSD(ussdCode);

      if (result.success) {
        const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        
        const categoriesRes = await axios.get(`${baseURL}/accounting/categories/`, {
          headers: token ? { Authorization: `Token ${token}` } : {}
        });
        const categories = categoriesRes.data.results || categoriesRes.data || [];
        const otherCategory = categories.find((cat: any) => 
          cat.name.toLowerCase() === 'other' && cat.category_type === 'expense'
        );

        if (otherCategory) {
          await transactionAPI.create({
            description: `${description} (${currency})`,
            amount: parseFloat(amount),
            transaction_type: 'expense',
            category: otherCategory.id,
            transaction_date: new Date().toISOString().split('T')[0],
            notes: `Ecocash - ${result.response || 'Completed'}`,
            status: 'completed',
          });
        }

        toast({
          title: 'Success',
          description: result.response || `${description} completed`,
        });
        
        onClose();
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process transaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayService = () => {
    if (!agentCode || !amount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    const ussdCode = currency === 'USD' 
      ? `*153*2*2*${agentCode}*${amount}#`
      : `*151*1*2*2*${agentCode}*${amount}#`;
    executeUSSD(ussdCode, 'Ecocash Pay Service');
  };

  const handleSendMoney = () => {
    if (!receiverNumber || !amount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    const ussdCode = currency === 'USD'
      ? `*153*1*1*${receiverNumber}*${amount}#`
      : `*151*1*1*1*${receiverNumber}*${amount}#`;
    executeUSSD(ussdCode, 'Ecocash Send Money');
  };

  const handleBuyAirtime = () => {
    if (!amount) {
      toast({ title: 'Error', description: 'Please enter amount', variant: 'destructive' });
      return;
    }
    const ussdCode = currency === 'USD'
      ? `*153*4*1*1*${amount}#`
      : `*151*1*4*1*1*${amount}#`;
    executeUSSD(ussdCode, 'Ecocash Buy Airtime');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Ecocash Transaction</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="text-2xl">&times;</span>
          </Button>
        </div>

        {!selectedService ? (
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg"
              onClick={() => setSelectedService('pay_service')}
            >
              Pay Service
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg"
              onClick={() => setSelectedService('send_money')}
            >
              Send Money
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg"
              onClick={() => setSelectedService('buy_airtime')}
            >
              Buy Airtime
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedService(null)}
            >
              ← Back
            </Button>

            <div className="space-y-2">
              <Label>Currency</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={currency === 'USD' ? 'default' : 'outline'}
                  onClick={() => setCurrency('USD')}
                >
                  USD
                </Button>
                <Button
                  type="button"
                  variant={currency === 'ZIG' ? 'default' : 'outline'}
                  onClick={() => setCurrency('ZIG')}
                >
                  ZIG
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {selectedService === 'pay_service' && (
              <div className="space-y-2">
                <Label htmlFor="agentCode">Agent Code</Label>
                <Input
                  id="agentCode"
                  type="number"
                  placeholder="Enter agent code"
                  value={agentCode}
                  onChange={(e) => setAgentCode(e.target.value)}
                />
              </div>
            )}

            {selectedService === 'send_money' && (
              <div className="space-y-2">
                <Label htmlFor="receiverNumber">Receiver Number</Label>
                <Input
                  id="receiverNumber"
                  type="tel"
                  placeholder="Enter receiver number"
                  value={receiverNumber}
                  onChange={(e) => setReceiverNumber(e.target.value)}
                />
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={loading}
              onClick={() => {
                if (selectedService === 'pay_service') handlePayService();
                else if (selectedService === 'send_money') handleSendMoney();
                else if (selectedService === 'buy_airtime') handleBuyAirtime();
              }}
            >
              {loading ? 'Processing...' : 'Proceed'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
