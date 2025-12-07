export type UserType = 'individual' | 'business';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'other';

export type GoalPriority = 'high' | 'medium' | 'low';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'ZWL';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  userType: UserType;
  currency: Currency;
  monthlyIncome?: number;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string;
  status: TransactionStatus;
  notes?: string;
  receiptUrl?: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetedAmount: number;
  spentAmount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: GoalPriority;
  status: GoalStatus;
  category: string;
  icon: string;
  color: string;
}

export interface DashboardMetrics {
  monthlyIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetHealthScore: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
}

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}
