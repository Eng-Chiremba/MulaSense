import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, ArrowUpRight } from 'lucide-react';
import ecocashService, { EcoCashPayment } from '@/services/ecocash.service';

export function EcoCashStatus() {
  const [recentPayments, setRecentPayments] = useState<EcoCashPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPayments();
  }, []);

  const loadRecentPayments = async () => {
    try {
      const payments = await ecocashService.getPayments();
      setRecentPayments(payments.slice(0, 3)); // Show last 3 payments
    } catch (error) {
      console.error('Failed to load EcoCash payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = recentPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-semibold text-sm">EcoCash</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-orange-600" />
        </div>

        {recentPayments.length > 0 ? (
          <>
            <div className="mb-2">
              <p className="text-xs text-gray-600">Recent Activity</p>
              <p className="font-bold text-lg">${totalAmount.toFixed(2)}</p>
            </div>
            
            <div className="space-y-1">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{payment.reason}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">${payment.amount}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1 py-0 ${
                        payment.status === 'completed' 
                          ? 'border-green-200 text-green-700' 
                          : payment.status === 'pending'
                          ? 'border-yellow-200 text-yellow-700'
                          : 'border-red-200 text-red-700'
                      }`}
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">No recent payments</p>
            <p className="text-xs text-orange-600 font-medium">Tap to make a payment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}