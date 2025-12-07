import { Calculator, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockTaxCalculation, mockBusinessMetrics } from '@/data/businessMockData';

export default function TaxCalculator() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ZIMRA Tax Calculator</h1>
          <p className="text-muted-foreground text-sm">January 2024</p>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="p-5 rounded-2xl gradient-hero text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">Total Tax Liability</p>
            <h2 className="text-3xl font-bold">${mockTaxCalculation.totalTax.toLocaleString()}</h2>
          </div>
        </div>
        <div className="pt-3 border-t border-primary-foreground/20">
          <p className="text-primary-foreground/80 text-sm">Monthly Provision</p>
          <p className="text-xl font-semibold">${mockTaxCalculation.monthlyProvision.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Corporate Income Tax</h3>
            <span className="text-xs text-muted-foreground">25%</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Profit: ${mockBusinessMetrics.netProfit.toLocaleString()}</p>
            <p className="font-bold text-primary">${mockTaxCalculation.corporateTax.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">VAT</h3>
            <span className="text-xs text-muted-foreground">15%</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Revenue: ${mockBusinessMetrics.monthlyRevenue.toLocaleString()}</p>
            <p className="font-bold text-primary">${mockTaxCalculation.vat.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Withholding Tax</h3>
            <span className="text-xs text-muted-foreground">10%</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Applicable Payments</p>
            <p className="font-bold text-primary">${mockTaxCalculation.withholdingTax.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <h4 className="font-semibold text-sm mb-2">Tax Compliance Reminder</h4>
        <p className="text-sm text-muted-foreground">
          Ensure timely filing by the 25th of each month. Keep all receipts and invoices for audit purposes.
        </p>
      </div>
    </div>
  );
}
