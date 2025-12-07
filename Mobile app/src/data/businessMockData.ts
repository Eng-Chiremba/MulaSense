import { 
  BusinessUser, 
  BusinessTransaction, 
  BusinessMetrics,
  ProfitLossStatement,
  TaxCalculation,
  CreditLine
} from '@/types/business';

export const mockBusinessUser: BusinessUser = {
  id: '1',
  businessName: 'TechStart Solutions',
  businessAddress: '123 Innovation Street, Harare',
  businessPhone: '+263 77 987 6543',
  taxId: 'ZW123456789',
  industry: 'Technology Services',
  monthlyRevenue: 25000,
};

export const businessCategories = {
  revenue: [
    { id: '1', name: 'Product Sales', color: '#2D358B' },
    { id: '2', name: 'Service Revenue', color: '#3B82F6' },
    { id: '3', name: 'Consulting', color: '#10B981' },
  ],
  expenses: [
    { id: '4', name: 'Payroll', color: '#EF4444' },
    { id: '5', name: 'Rent', color: '#F59E0B' },
    { id: '6', name: 'Utilities', color: '#8B5CF6' },
    { id: '7', name: 'Marketing', color: '#EC4899' },
    { id: '8', name: 'Supplies', color: '#06B6D4' },
  ],
};

export const mockBusinessTransactions: BusinessTransaction[] = [
  {
    id: '1',
    amount: 5000,
    type: 'sale',
    category: 'Product Sales',
    description: 'Software License Sale',
    date: '2024-01-15',
    customer: 'ABC Corp',
    invoiceRef: 'INV-001',
    taxAmount: 750,
  },
  {
    id: '2',
    amount: 3500,
    type: 'sale',
    category: 'Service Revenue',
    description: 'Monthly Maintenance',
    date: '2024-01-14',
    customer: 'XYZ Ltd',
    invoiceRef: 'INV-002',
    taxAmount: 525,
  },
  {
    id: '3',
    amount: 8000,
    type: 'payroll',
    category: 'Payroll',
    description: 'Staff Salaries',
    date: '2024-01-13',
    taxAmount: 800,
  },
  {
    id: '4',
    amount: 1200,
    type: 'expense',
    category: 'Rent',
    description: 'Office Rent',
    date: '2024-01-10',
    vendor: 'Property Management Co',
  },
  {
    id: '5',
    amount: 450,
    type: 'expense',
    category: 'Utilities',
    description: 'Electricity & Internet',
    date: '2024-01-09',
    vendor: 'Utility Provider',
  },
];

export const mockBusinessMetrics: BusinessMetrics = {
  monthlyRevenue: 25000,
  monthlyExpenses: 18500,
  netProfit: 6500,
  profitMargin: 26,
  cashFlow: 8200,
  revenueChange: 15.3,
  expenseChange: -5.2,
};

export const mockProfitLoss: ProfitLossStatement = {
  period: 'January 2024',
  revenue: [
    { category: 'Product Sales', amount: 12000 },
    { category: 'Service Revenue', amount: 8500 },
    { category: 'Consulting', amount: 4500 },
  ],
  expenses: [
    { category: 'Payroll', amount: 10000 },
    { category: 'Rent', amount: 2400 },
    { category: 'Utilities', amount: 800 },
    { category: 'Marketing', amount: 3000 },
    { category: 'Supplies', amount: 2300 },
  ],
  totalRevenue: 25000,
  totalExpenses: 18500,
  netProfit: 6500,
  profitMargin: 26,
};

export const mockTaxCalculation: TaxCalculation = {
  corporateTax: 1625, // 25% of net profit
  vat: 3750, // 15% of revenue
  withholdingTax: 1000, // 10% on certain payments
  totalTax: 6375,
  monthlyProvision: 531.25,
};

export const mockCreditLine: CreditLine = {
  id: '1',
  amount: 2500,
  status: 'approved',
  appliedDate: '2024-01-10',
  approvedDate: '2024-01-10',
  interestRate: 12,
  availableCredit: 2500,
};
