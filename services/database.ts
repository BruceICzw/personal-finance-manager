// SQLite database module for Expo (optimized and TypeScript-compatible)
// Using async/await patterns as per Expo SQLite documentation&#8203;:contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}&#8203;:contentReference[oaicite:2]{index=2}

import { Budget, Transaction, TransactionType } from '@/types';
import * as SQLite from 'expo-sqlite';

/**
 * Interface representing a Category row in the database.
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

const DATABASE_NAME = 'wealthwiseDB.db';

// Cached database instance
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database:
 * - Opens the database (creates if not exists)&#8203;:contentReference[oaicite:3]{index=3}.
 * - Creates tables if they do not exist.
 * - Inserts default category data if table is empty.
 */
export async function initDatabase(): Promise<void> {
  if (db !== null) {
    // Already initialized
    return;
  }
  try {
    // Open (or create) the database
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);


      // Create Categories table if it does not exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);

    // Check if the `icon` column exists in the `categories` table
    const result = await db!.getAllAsync<{ name: string }>(
      "PRAGMA table_info(categories)"
    );
    const hasIconColumn = result.some(column => column.name === "icon");

    if (!hasIconColumn) {
      // Create a new table with the updated schema
      await db!.execAsync(`
        CREATE TABLE IF NOT EXISTS categories_new (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT NOT NULL,
          type TEXT NOT NULL
        );
      `);

      // Copy data from the old table to the new table
      await db!.execAsync(`
        INSERT INTO categories_new (id, name, color, icon, type)
        SELECT id, name, color, '' AS icon, 'expense' AS type FROM categories;
      `);

      // Drop the old table
      await db!.execAsync("DROP TABLE categories;");

      // Rename the new table to the original name
      await db!.execAsync("ALTER TABLE categories_new RENAME TO categories;");
    }

    // Create Transactions table if it does not exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        categoryId TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);

    // Create Budgets table if it does not exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        spent REAL NOT NULL,
        categoryId TEXT,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL
      );
    `);

    // Check if default data needs to be inserted
    const existing: Category[] = await db.getAllAsync<Category>(
      "SELECT * FROM categories"
    );
    if (existing.length === 0) {
      const defaultCategories = [
        { name: "General", color: "#9e9e9e", icon: "📦", type: "expense" },
        { name: "Food", color: "#ff5252", icon: "🍔", type: "expense" },
        { name: "Travel", color: "#536dfe", icon: "✈️", type: "expense" },
        { name: "Shopping", color: "#ffab40", icon: "🛍️", type: "expense" },
        { name: "Work", color: "#00c853", icon: "💼", type: "income" },
        { name: "Salary", color: "#00b0ff", icon: "💰", type: "income" },
        { name: "Investment", color: "#ffd740", icon: "📈", type: "income" },
        { name: "Entertainment", color: "#ff4081", icon: "🎉", type: "expense" },
        { name: "Health", color: "#64dd17", icon: "🏥", type: "expense" },
        { name: "Utilities", color: "#ff6d00", icon: "💡", type: "expense" },
        { name: "Education", color: "#2979ff", icon: "📚", type: "expense" },
        { name: "Miscellaneous", color: "#ff4081", icon: "🗂️", type: "expense" },
        { name: "Savings", color: "#00e676", icon: "💵", type: "income" },
        { name: "Gifts", color: "#ff4081", icon: "🎁", type: "expense" },
        { name: "Subscriptions", color: "#ff6d00", icon: "📅", type: "expense" },
        { name: "Taxes", color: "#ff3d00", icon: "💸", type: "expense" },
        { name: "Insurance", color: "#ff6d00", icon: "🛡️", type: "expense" },
        { name: "Charity", color: "#ff4081", icon: "❤️", type: "expense" },
        { name: "Emergency Fund", color: "#00c853", icon: "🚑", type: "expense" },
        { name: "Retirement", color: "#ffd740", icon: "👵", type: "income" },
        { name: "Business", color: "#00b0ff", icon: "🏢", type: "income" },
      ];

      for (const cat of defaultCategories) {
        await db!.runAsync(
          `INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)`,
          [cat.name, cat.color, cat.icon, cat.type]
        );
      }
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
/**
 * Fetch all categories from the database.
 * @returns Promise resolving to an array of Category objects.
 */
export async function getCategories(): Promise<Category[]> {
  if (!db) {
    await initDatabase();
  }
  try {
    const categories = await db!.getAllAsync<Category>(
      'SELECT id, name, color, icon, type FROM categories'
    );
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

/**
 * Inserts a new category into the database.
 * @param name  Name of the category.
 * @param color Color code of the category.
 * @returns Promise resolving to the new category's ID.
 */
export async function insertCategory(
  name: string,
  color: string
): Promise<number> {
  if (!db) {
    await initDatabase();
  }
  try {
    const result = await db!.runAsync(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      [name, color]
    );
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error('Failed to insert category:', error);
    throw error;
  }
}

/**
 * Updates an existing category.
 * @param id    ID of the category to update.
 * @param name  New name of the category.
 * @param color New color of the category.
 * @returns Promise resolving to the number of rows updated.
 */
export async function updateCategory(
  id: number,
  name: string,
  color: string
): Promise<number> {
  if (!db) {
    await initDatabase();
  }
  try {
    const result = await db!.runAsync(
      'UPDATE categories SET name = ?, color = ? WHERE id = ?',
      [name, color, id]
    );
    return result.changes;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

/**
 * Deletes a category by ID.
 * @param id ID of the category to delete.
 * @returns Promise resolving to the number of rows deleted.
 */
export async function deleteCategory(id: number): Promise<number> {
  if (!db) {
    await initDatabase();
  }
  try {
    const result = await db!.runAsync('DELETE FROM categories WHERE id = ?', [
      id,
    ]);
    return result.changes;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

/**
 * Fetches all transactions from the database.
 * @returns Promise resolving to an array of transactions.
 */
export async function getTransactions(): Promise<Transaction[]> {
  if (!db) {
    await initDatabase();
  }
  try {
    const transactions = await db!.getAllAsync<Transaction>(
      'SELECT * FROM transactions'
    );
    return transactions;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

/**
 * Inserts a new transaction into the database.
 * @param transaction Transaction object to insert.
 * @returns Promise resolving to the new transaction's ID.
 */
export async function addTransaction(transaction: Transaction): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync(
      'INSERT INTO transactions (id, amount, date, description, categoryId, type) VALUES (?, ?, ?, ?, ?, ?)',
      [
        transaction.id,
        transaction.amount,
        transaction.date,
        transaction.description,
        transaction.categoryId,
        transaction.type,
      ]
    );
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw error;
  }
}

/**
 * Updates an existing transaction.
 * @param transaction Transaction object to update.
 * @returns Promise resolving to the number of rows updated.
 */
export async function updateTransaction(
  transaction: Transaction
): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync(
      'UPDATE transactions SET amount = ?, date = ?, description = ?, categoryId = ?, type = ? WHERE id = ?',
      [
        transaction.amount,
        transaction.date,
        transaction.description,
        transaction.categoryId,
        transaction.type,
        transaction.id,
      ]
    );
  } catch (error) {
    console.error('Failed to update transaction:', error);
    throw error;
  }
}

/**
 * Deletes a transaction by ID.
 * @param id ID of the transaction to delete.
 * @returns Promise resolving to the number of rows deleted.
 */
export async function deleteTransaction(id: string): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
}


/**
 * Fetches all budgets
 * @returns Promise resolving to an array of budgets.
 */
export async function getBudgets(): Promise<Budget[]> {
  if (!db) {
    await initDatabase();
  }
  try {
    const budgets = await db!.getAllAsync<Budget>(
      'SELECT id, name, amount, spent, categoryId, startDate, endDate FROM budgets'
    );
    return budgets;
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    throw error;
  }
}

/**
 * Inserts a new budget into the database.
 * @param budget Budget object to insert.
 * @returns Promise resolving to the new budget's ID.
 */
export async function addBudget(budget: Budget): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync(
      'INSERT INTO budgets (id, name, amount, spent, categoryId, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        budget.id,
        budget.name,
        budget.amount,
        budget.spent,
        budget.categoryId,
        budget.startDate,
        budget.endDate,
      ]
    );
  } catch (error) {
    console.error('Failed to add budget:', error);
    throw error;
  }
}

/**
 * Updates an existing budget.
 * @param budget Budget object to update.
 * @returns Promise resolving to the number of rows updated.
 */
export async function updateBudget(budget: Budget): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync(
      'UPDATE budgets SET name = ?, amount = ?, spent = ?, categoryId = ?, startDate = ?, endDate = ? WHERE id = ?',
      [
        budget.name,
        budget.amount,
        budget.spent,
        budget.categoryId,
        budget.startDate,
        budget.endDate,
        budget.id,
      ]
    );
  } catch (error) {
    console.error('Failed to update budget:', error);
    throw error;
  }
}


/**
 * Deletes a budget by ID.
 * @param id ID of the budget to delete.
 * @returns Promise resolving to the number of rows deleted.
 */

export async function deleteBudget(id: string): Promise<void> {
  if (!db) {
    await initDatabase();
  }
  try {
    await db!.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete budget:', error);
    throw error;
  }
}


export async function exportData(): Promise<string> {
  if (!db) {
    await initDatabase();
  }
  try {
    const categories = await getCategories();
    const transactions = await getTransactions();
    const budgets = await getBudgets();

    return JSON.stringify({ categories, transactions, budgets }, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
}
