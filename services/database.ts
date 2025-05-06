import { Budget, Transaction, Category } from '@/types';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'wealthwiseDB.db';
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database:
 * - Opens the database (creates if not exists).
 * - Creates tables if they do not exist.
 * - Inserts default category data if table is empty.
 */
export async function initDatabase(): Promise<void> {
  if (db) {
    console.log('Database already initialized.');
    return; // Database already initialized
  }

  console.log(`Initializing database: ${DATABASE_NAME}`);
  try {
    // Correct call to openDatabaseAsync with only the database name.
    // This uses default options and the default directory.
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('Database opened successfully.');

    // Enable WAL mode for better concurrency
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        categoryId INTEGER,
        amount REAL NOT NULL,
        date TEXT NOT NULL, -- Store dates as ISO8601 strings (YYYY-MM-DD)
        description TEXT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL, -- Added name column based on previous context
        categoryId TEXT, -- Changed to TEXT, Nullable for 'All Categories' budget
        amount REAL NOT NULL,
        spent REAL NOT NULL DEFAULT 0, -- Add this line for the spent amount
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL -- Changed ON DELETE action
      );
    `);
    console.log('Tables checked/created successfully.');

    // Check if categories table is empty and insert defaults if needed
    const categoriesResult = await db.getAllAsync<Category>(
      'SELECT * FROM categories',
    );
    if (categoriesResult.length === 0) {
      console.log('Inserting default categories...');
      // Use a transaction for bulk inserts
      await db.withTransactionAsync(async () => {
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['General', '#9e9e9e', '📦', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Food', '#ff5252', '🍔', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Travel', '#536dfe', '✈️', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Shopping', '#ffab40', '🛍️', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Work', '#00c853', '💼', 'income'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Salary', '#00b0ff', '💰', 'income'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Investment', '#ffd740', '📈', 'income'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Entertainment', '#ff4081', '🎉', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Health', '#64dd17', '🏥', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Utilities', '#ff6d00', '💡', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Education', '#2979ff', '📚', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Miscellaneous', '#ff4081', '🗂️', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Savings', '#00e676', '💵', 'income'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Gifts', '#ff4081', '🎁', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Subscriptions', '#ff6d00', '📅', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Taxes', '#ff3d00', '💸', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Insurance', '#ff6d00', '🛡️', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Charity', '#ff4081', '❤️', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Emergency Fund', '#00c853', '🚑', 'expense'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Retirement', '#ffd740', '👵', 'income'],
        );
        await db!.runAsync(
          'INSERT INTO categories (name, color, icon, type) VALUES (?, ?, ?, ?)',
          ['Business', '#00b0ff', '🏢', 'income'],
        );
      });
      console.log('Default categories inserted.');
    } else {
      console.log(
        `Categories table already populated with ${categoriesResult.length} items.`,
      );
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Propagate the error or handle it appropriately in the calling code
    throw error;
  }
}

/**
 * Gets the initialized database instance. Throws an error if not initialized.
 * @returns The SQLiteDatabase instance.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    // Attempt to initialize if not already done (optional, depends on app flow)
    // console.warn('Database accessed before explicit initialization. Attempting to initialize now.');
    // await initDatabase(); // Be cautious with async calls here if not handled properly

    // It's generally better to ensure initDatabase is called reliably at app start.
    console.error('Database not initialized. Call initDatabase() first.');
    throw new Error(
      'Database is not initialized. Ensure initDatabase() is called and completes successfully before accessing the database.',
    );
  }
  return db;
}

// --- Modify your other database functions to use getDatabase() ---

/**
 * Fetch all categories from the database.
 * @returns Promise resolving to an array of Category objects.
 */
export async function getCategories(): Promise<Category[]> {
  const currentDb = getDatabase(); // Get the initialized DB instance
  try {
    const results = await currentDb.getAllAsync<Category>(
      'SELECT * FROM categories ORDER BY name',
    );
    console.log(`Fetched ${results.length} categories.`);
    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
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
  color: string,
): Promise<number> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      [name, color],
    );
    console.log(
      `Category '${name}' inserted with ID: ${result.lastInsertRowId}`,
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error(`Error inserting category '${name}':`, error);
    throw error; // Re-throw
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
  color: string,
): Promise<number> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'UPDATE categories SET name = ?, color = ? WHERE id = ?',
      [name, color, id],
    );
    console.log(`Category ID ${id} updated. Rows affected: ${result.changes}`);
    return result.changes;
  } catch (error) {
    console.error(`Error updating category ID ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a category.
 * @param id ID of the category to delete.
 * @returns Promise resolving to the number of rows deleted.
 */
export async function deleteCategory(id: number): Promise<number> {
  const currentDb = getDatabase();
  try {
    // Note: Related transactions might have categoryId set to NULL due to FOREIGN KEY constraint
    const result = await currentDb.runAsync(
      'DELETE FROM categories WHERE id = ?',
      [id],
    );
    console.log(`Category ID ${id} deleted. Rows affected: ${result.changes}`);
    return result.changes;
  } catch (error) {
    console.error(`Error deleting category ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all transactions from the database.
 * @returns Promise resolving to an array of Transaction objects.
 */
export async function getTransactions(): Promise<Transaction[]> {
  const currentDb = getDatabase();
  try {
    // Order by date descending to show recent transactions first
    const results = await currentDb.getAllAsync<Transaction>(
      'SELECT * FROM transactions ORDER BY date DESC',
    );
    console.log(`Fetched ${results.length} transactions.`);
    return results;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Adds a new transaction to the database.
 * @param transaction Transaction object (without id).
 */
export async function addTransaction(
  transaction: Transaction,
): Promise<void> {
  const currentDb = getDatabase();
  try {
    await currentDb.runAsync(
      'INSERT INTO transactions (id, categoryId, amount, date, description, type) VALUES (?, ?, ?, ?, ?, ?)',
      [
        transaction.id,
        transaction.categoryId,
        transaction.amount,
        transaction.date,
        transaction.description ?? null,
        transaction.type,
      ],
    );
    console.log(`Transaction added with ID: ${transaction.id}`);
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

/**
 * Updates an existing transaction.
 * @param transaction The complete Transaction object with id.
 */
export async function updateTransaction(
  transaction: Transaction,
): Promise<void> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'UPDATE transactions SET categoryId = ?, amount = ?, date = ?, description = ?, type = ? WHERE id = ?',
      [
        transaction.categoryId,
        transaction.amount,
        transaction.date,
        transaction.description ?? null,
        transaction.type,
        transaction.id,
      ],
    );
    console.log(
      `Transaction ID ${transaction.id} updated. Rows affected: ${result.changes}`,
    );
    if (result.changes === 0) {
      console.warn(
        `Attempted to update non-existent transaction ID: ${transaction.id}`,
      );
    }
  } catch (error) {
    console.error(`Error updating transaction ID ${transaction.id}:`, error);
    throw error;
  }
}

/**
 * Deletes a transaction by its ID.
 * @param id ID of the transaction to delete.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'DELETE FROM transactions WHERE id = ?',
      [id],
    );
    console.log(
      `Transaction ID ${id} deleted. Rows affected: ${result.changes}`,
    );
    if (result.changes === 0) {
      console.warn(`Attempted to delete non-existent transaction ID: ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting transaction ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all budgets from the database.
 * @returns Promise resolving to an array of Budget objects.
 */
export async function getBudgets(): Promise<Budget[]> {
  const currentDb = getDatabase();
  try {
    const results = await currentDb.getAllAsync<Budget>(
      'SELECT * FROM budgets ORDER BY endDate DESC',
    );
    console.log(`Fetched ${results.length} budgets.`);
    return results;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
}

/**
 * Adds a new budget to the database.
 * @param budget Budget object (without id).
 */
export async function addBudget(budget: Budget): Promise<void> {
  const currentDb = getDatabase();
  try {
    await currentDb.runAsync(
      'INSERT INTO budgets (name, id, categoryId, amount, spent,  startDate, endDate) VALUES (?, ?, ?, ?, ?, ?,  ?)',
      [
        budget.name,
        budget.id,
        budget.categoryId,
        budget.amount,
        0, // Initial spent amount is 0
        budget.startDate,
        budget.endDate,
      ],
    );
    console.log(`Budget added with ID: ${budget.id}`);
  } catch (error) {
    console.error('Error adding budget:', error);
    throw error;
  }
}

/**
 * Updates an existing budget.
 * @param budget The complete Budget object with id.
 */
export async function updateBudget(budget: Budget): Promise<void> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'UPDATE budgets SET name = ?,  categoryId = ?, amount = ?, spent = ?,  startDate = ?, endDate = ? WHERE id = ?',
      [
        budget.name,
        budget.categoryId,
        budget.amount,
        budget.spent,
        budget.startDate,
        budget.endDate,
        budget.id,
      ],
    );
    console.log(
      `Budget ID ${budget.id} updated. Rows affected: ${result.changes}`,
    );
    if (result.changes === 0) {
      console.warn(`Attempted to update non-existent budget ID: ${budget.id}`);
    }
  } catch (error) {
    console.error(`Error updating budget ID ${budget.id}:`, error);
    throw error;
  }
}

/**
 * Deletes a budget by its ID.
 * @param id ID of the budget to delete.
 */
export async function deleteBudget(id: string): Promise<void> {
  const currentDb = getDatabase();
  try {
    const result = await currentDb.runAsync(
      'DELETE FROM budgets WHERE id = ?',
      [id],
    );
    console.log(`Budget ID ${id} deleted. Rows affected: ${result.changes}`);
    if (result.changes === 0) {
      console.warn(`Attempted to delete non-existent budget ID: ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting budget ID ${id}:`, error);
    throw error;
  }
}

/**
 * Exports database data as a JSON string.
 * @returns Promise resolving to a JSON string of the data.
 */
export async function exportData(): Promise<string> {
  const currentDb = getDatabase();
  try {
    const categories = await currentDb.getAllAsync<Category>(
      'SELECT * FROM categories',
    );
    const transactions = await currentDb.getAllAsync<Transaction>(
      'SELECT * FROM transactions',
    );
    const budgets = await currentDb.getAllAsync<Budget>(
      'SELECT * FROM budgets',
    );

    const data = {
      categories,
      transactions,
      budgets,
    };
    console.log('Data exported successfully.');
    return JSON.stringify(data, null, 2); // Pretty print JSON
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error; // Or return an error indicator
  }
}

// Add other necessary functions or utilities related to the database here.
