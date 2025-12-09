import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import ecocashService, { EcoCashPayment, EcoCashService } from '@/services/ecocash.service';
import { EcocashDialog } from '@/components/features/EcocashDialog';
import { formatDistanceToNow } from 'date-fns';

export default function EcoCashPayments() {
  const [payments, setPayments] = useState<EcoCashPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await ecocashService.getPayments();
      setPayments(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">EcoCash Payments</h1>
        <Button onClick={() => setShowDialog(true)}>
          New Payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No payments yet</p>
            <Button onClick={() => setShowDialog(true)}>
              Make Your First Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{payment.reason}</h3>
                    <p className="text-sm text-gray-600">
                      {payment.customer_msisdn}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {EcoCashService.getCurrencySymbol(payment.currency)} {payment.amount}
                    </p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status_display || payment.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                  </span>
                  <span className="font-mono text-xs">
                    {payment.source_reference.split('-')[0]}...
                  </span>
                </div>

                {payment.error_message && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {payment.error_message}
                  </div>
                )}

                {payment.ecocash_transaction_id && (
                  <div className="mt-2 text-xs text-gray-500">
                    EcoCash ID: {payment.ecocash_transaction_id}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showDialog && (
        <EcocashDialog 
          onClose={() => {
            setShowDialog(false);
            loadPayments(); // Refresh payments after new payment
          }} 
        />
      )}
    </div>
  );
}