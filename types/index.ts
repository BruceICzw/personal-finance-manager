export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  amount: number;
  date: string; // ISO date string
  description: string;
  categoryId: string;
  type: TransactionType;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};

export type Budget = {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId: string | null;
  startDate: string;
  endDate: string;
};

export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Theme = 'light' | 'dark' | 'system';