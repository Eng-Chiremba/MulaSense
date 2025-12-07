export type BusinessTransactionType = 'sale' | 'purchase' | 'payroll' | 'expense';

export type TaxType = 'corporate' | 'vat' | 'withholding';

export type CreditStatus = 'pending' | 'approved' | 'rejected' | 'active';

export interface BusinessUser {
  id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  taxId?: string;
  industry?: string;
  monthlyRevenue: number;
}

export interface BusinessTransaction {
  id: string;
  amount: number;
  type: BusinessTransactionType;
  category: string;
  description: string;
  date: string;
  vendor?: string;
  customer?: string;
  invoiceRef?: string;
  taxAmount?: number;
  receiptUrl?: string;
}

export interface BusinessMetrics {
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  revenueChange: number;
  expenseChange: number;
}

export interface ProfitLossStatement {
  period: string;
  revenue: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface CashFlowStatement {
  period: string;
  operating: number;
  investing: number;
  financing: number;
  netCashFlow: number;
}

export interface TaxCalculation {
  corporateTax: number;
  vat: number;
  withholdingTax: number;
  totalTax: number;
  monthlyProvision: number;
}

export interface CreditLine {
  id: string;
  amount: number;
  status: CreditStatus;
  appliedDate: string;
  approvedDate?: string;
  interestRate: number;
  availableCredit: number;
}
