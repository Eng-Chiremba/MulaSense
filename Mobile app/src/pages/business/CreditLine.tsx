import { CreditCard, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockCreditLine, mockBusinessUser } from '@/data/businessMockData';
import { useState } from 'react';

export default function CreditLine() {
  const [applying, setApplying] = useState(false);
  const creditLimit = Math.floor(mockBusinessUser.monthlyRevenue * 0.1);
  const minCredit = 500;
  const finalLimit = Math.max(creditLimit, minCredit);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
    }, 2000);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Credit Line</h1>
        <p className="text-muted-foreground text-sm">Instant approval based on revenue</p>
      </div>

      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">Available Credit</p>
            <h2 className="text-3xl font-bold">${mockCreditLine.availableCredit.toLocaleString()}</h2>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-primary-foreground/20">
          <div>
            <p className="text-primary-foreground/80 text-xs">Credit Limit</p>
            <p className="font-semibold">${mockCreditLine.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-primary-foreground/80 text-xs">Interest Rate</p>
            <p className="font-semibold">{mockCreditLine.interestRate}% APR</p>
          </div>
          <div>
            <p className="text-primary-foreground/80 text-xs">Status</p>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <p className="font-semibold capitalize">{mockCreditLine.status}</p>
            </div>
          </div>
        </div>
      </div>

      {mockCreditLine.status === 'approved' ? (
        <div className="space-y-3">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
            <h3 className="font-semibold mb-3">Credit Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Applied Date</span>
                <span className="font-medium">{mockCreditLine.appliedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Approved Date</span>
                <span className="font-medium">{mockCreditLine.approvedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-medium">${mockBusinessUser.monthlyRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-12" variant="gradient">
            <DollarSign className="w-4 h-4" />
            Request Funds
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
            <h3 className="font-semibold mb-3">Eligibility Calculator</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-medium">${mockBusinessUser.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credit Limit (10%)</span>
                <span className="font-medium">${creditLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Credit</span>
                <span className="font-medium">${minCredit.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between">
                <span className="font-semibold">Your Credit Limit</span>
                <span className="font-bold text-primary text-lg">${finalLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-12" 
            variant="gradient"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Apply Now - Instant Approval
              </>
            )}
          </Button>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <h4 className="font-semibold text-sm mb-2">How it works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Credit limit: 10% of monthly revenue (min $500)</li>
              <li>• Instant approval in 60 seconds</li>
              <li>• Funds available immediately</li>
              <li>• Flexible repayment terms</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
