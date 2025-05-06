import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Transaction, Category, Budget, TimeFilter } from '@/types';
import * as db from '@/services/database';
import { format, parseISO, startOfDay, endOfDay, sub, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Alert } from 'react-native';

type DataContextType = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getFilteredTransactions: (filter: TimeFilter, date?: Date) => Transaction[];
  getTotalsByType: (filter: TimeFilter, date?: Date) => { income: number; expense: number; balance: number };
  getCategoryTotals: (transactions: Transaction[]) => { categoryId: string; amount: number }[];
  exportData: () => Promise<string>;
  refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType>({
  transactions: [],
  categories: [],
  budgets: [],
  loading: true,
  error: null,
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  addBudget: async () => {},
  updateBudget: async () => {},
  deleteBudget: async () => {},
  getFilteredTransactions: () => [],
  getTotalsByType: () => ({ income: 0, expense: 0, balance: 0 }),
  getCategoryTotals: () => [],
  exportData: async () => '',
  refreshData: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database
      await db.initDatabase();
      
      // Load categories
      const loadedCategories = await db.getCategories();
      setCategories(loadedCategories);
      
      // Load transactions
      const loadedTransactions = await db.getTransactions();
      setTransactions(loadedTransactions);
      
      // Load budgets
      const loadedBudgets = await db.getBudgets();
      setBudgets(loadedBudgets);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const id = Date.now().toString();
      const newTransaction: Transaction = { ...transaction, id };
      
      await db.addTransaction(newTransaction);
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      // Update budget spent amount if applicable
      if (transaction.type === 'expense') {
        const relevantBudgets = budgets.filter(budget => {
          const transactionDate = parseISO(transaction.date);
          const budgetStartDate = parseISO(budget.startDate);
          const budgetEndDate = parseISO(budget.endDate);
          
          // Check if transaction falls within budget period and matches category (if specified)
          return (
            transactionDate >= budgetStartDate && 
            transactionDate <= budgetEndDate && 
            (!budget.categoryId || budget.categoryId == transaction.categoryId)
          );
        });
        
        // Update relevant budgets
        for (const budget of relevantBudgets) {
          const updatedBudget = {
            ...budget,
            spent: budget.spent + transaction.amount
          };
          await db.updateBudget(updatedBudget);
        }
        
        // Refresh budgets after updates
        const updatedBudgets = await db.getBudgets();
        setBudgets(updatedBudgets);
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  // Update an existing transaction
  const updateTransaction = async (transaction: Transaction) => {
    try {
      await db.updateTransaction(transaction);
      
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === transaction.id ? transaction : t)
      );
      
      // Refresh budgets after updates (simpler approach than calculating the differences)
      const updatedBudgets = await db.getBudgets();
      setBudgets(updatedBudgets);
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      await db.deleteTransaction(id);
      setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
      
      // Refresh budgets after deletion
      const updatedBudgets = await db.getBudgets();
      setBudgets(updatedBudgets);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  // Add a new budget
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const id = Date.now().toString();
      const newBudget: Budget = { ...budget, id };
      
      await db.addBudget(newBudget);
      setBudgets(prevBudgets => [newBudget, ...prevBudgets]);
    } catch (err) {
      console.error('Error adding budget:', err);
      throw err;
    }
  };

  // Update an existing budget
  const updateBudget = async (budget: Budget) => {
    try {
      await db.updateBudget(budget);
      setBudgets(prevBudgets => 
        prevBudgets.map(b => b.id === budget.id ? budget : b)
      );
    } catch (err) {
      console.error('Error updating budget:', err);
      throw err;
    }
  };

  // Delete a budget
  const deleteBudget = async (id: string) => {
    try {
      await db.deleteBudget(id);
      setBudgets(prevBudgets => prevBudgets.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting budget:', err);
      throw err;
    }
  };

  // Get transactions filtered by time period
  const getFilteredTransactions = (filter: TimeFilter, date: Date = new Date()) => {
    let startDate: Date;
    let endDate: Date;
    
    switch (filter) {
      case 'daily':
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case 'weekly':
        startDate = startOfWeek(date, { weekStartsOn: 1 });
        endDate = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case 'yearly':
        startDate = startOfYear(date);
        endDate = endOfYear(date);
        break;
      default:
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
    }
    
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  // Calculate totals by transaction type
  const getTotalsByType = (filter: TimeFilter, date: Date = new Date()) => {
    const filteredTransactions = getFilteredTransactions(filter, date);
    
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense
    };
  };

  // Get totals by category
  const getCategoryTotals = (transactions: Transaction[]) => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      if (!categoryTotals[transaction.categoryId]) {
        categoryTotals[transaction.categoryId] = 0;
      }
      categoryTotals[transaction.categoryId] += transaction.amount;
    });
    
    return Object.entries(categoryTotals).map(([categoryId, amount]) => ({
      categoryId,
      amount
    }));
  };

  // Export data
  const exportData = async () => {
    try {
      return await db.exportData();
    } catch (err) {
      console.error('Error exporting data:', err);
      throw err;
    }
  };

  // Refresh data
  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getFilteredTransactions,
        getTotalsByType,
        getCategoryTotals,
        exportData,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);