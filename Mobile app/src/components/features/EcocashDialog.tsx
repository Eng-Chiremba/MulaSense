import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import ecocashService, { EcoCashService } from '@/services/ecocash.service';

interface EcocashDialogProps {
  onClose: () => void;
}

type ServiceType = 'pay_merchant' | 'send_money' | 'buy_airtime' | null;

export function EcocashDialog({ onClose }: EcocashDialogProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [currency, setCurrency] = useState<'USD' | 'ZIG'>('USD');
  const [amount, setAmount] = useState('');
  const [merchantCode, setMerchantCode] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayMerchant = async () => {
    if (!merchantCode || !amount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payment = await ecocashService.payMerchant({
        merchant_code: merchantCode,
        amount: parseFloat(amount),
        reason: reason || 'Merchant payment',
        currency
      });

      toast({
        title: 'Payment Initiated',
        description: `Payment of ${currency} ${amount} to merchant ${merchantCode}. Reference: ${payment.source_reference}`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!receiverNumber || !amount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payment = await ecocashService.sendMoney({
        recipient_msisdn: EcoCashService.formatPhoneNumber(receiverNumber),
        amount: parseFloat(amount),
        reason: reason || 'Money transfer',
        currency
      });

      toast({
        title: 'Money Sent',
        description: `${currency} ${amount} sent to ${receiverNumber}. Reference: ${payment.source_reference}`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Failed to send money',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAirtime = async () => {
    if (!phoneNumber || !amount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payment = await ecocashService.buyAirtime({
        phone_number: EcoCashService.formatPhoneNumber(phoneNumber),
        amount: parseFloat(amount),
        currency
      });

      toast({
        title: 'Airtime Purchased',
        description: `${currency} ${amount} airtime for ${phoneNumber}. Reference: ${payment.source_reference}`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to buy airtime',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">EcoCash Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="text-2xl">&times;</span>
          </Button>
        </div>

        {!selectedService ? (
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg"
              onClick={() => setSelectedService('pay_merchant')}
            >
              Pay Merchant
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

            {selectedService === 'pay_merchant' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="merchantCode">Merchant Code</Label>
                  <Input
                    id="merchantCode"
                    type="text"
                    placeholder="Enter merchant code"
                    value={merchantCode}
                    onChange={(e) => setMerchantCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    type="text"
                    placeholder="Payment description"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedService === 'send_money' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="receiverNumber">Receiver Number</Label>
                  <Input
                    id="receiverNumber"
                    type="tel"
                    placeholder="263774222475"
                    value={receiverNumber}
                    onChange={(e) => setReceiverNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    type="text"
                    placeholder="Money transfer"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedService === 'buy_airtime' && (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="263774222475"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={loading}
              onClick={() => {
                if (selectedService === 'pay_merchant') handlePayMerchant();
                else if (selectedService === 'send_money') handleSendMoney();
                else if (selectedService === 'buy_airtime') handleBuyAirtime();
              }}
            >
              {loading ? 'Processing...' : 'Pay with EcoCash'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}