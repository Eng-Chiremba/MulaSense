export interface Transaction {
  id: number | string;
  description: string;
  amount: string | number;
  transaction_type: 'income' | 'expense';
  transaction_date: string; // ISO date string
  category?: {
    id: number;
    name: string;
  };
}