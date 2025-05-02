import { Category } from '@/types';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#10b981',
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#f59e0b',
    type: 'expense',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'car',
    color: '#3b82f6',
    type: 'expense',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: 'heart',
    color: '#ef4444',
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: '#8b5cf6',
    type: 'expense',
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'home',
    color: '#64748b',
    type: 'expense',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'plug',
    color: '#0ea5e9',
    type: 'expense',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'repeat',
    color: '#ec4899',
    type: 'expense',
  },
  {
    id: 'other_expense',
    name: 'Other',
    icon: 'more-horizontal',
    color: '#6b7280',
    type: 'expense',
  },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salary',
    icon: 'briefcase',
    color: '#10b981',
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'laptop',
    color: '#3b82f6',
    type: 'income',
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: 'trending-up',
    color: '#f59e0b',
    type: 'income',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: 'gift',
    color: '#ec4899',
    type: 'income',
  },
  {
    id: 'other_income',
    name: 'Other',
    icon: 'more-horizontal',
    color: '#6b7280',
    type: 'income',
  },
];

export const ALL_CATEGORIES = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];