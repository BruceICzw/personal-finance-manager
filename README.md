# Wealth Wise - Personal Finance Manager

**Wealth Wise** is a mobile application built with React Native and Expo, designed to help users manage their personal finances effectively. It allows users to track income and expenses, set budgets, and visualize their spending patterns.

## Core Technologies:

*   **React Native:** A JavaScript framework for building native mobile apps.
*   **Expo:** A platform and toolset for building universal React applications.
*   **Expo Router:** Used for file-system based routing.
*   **SQLite:** A local SQL database used for storing financial data (transactions, categories, budgets) via `expo-sqlite`.
*   **TypeScript:** For static typing and improved code quality.
*   **React Context API:** Used for state management, specifically for theme (`ThemeProvider`) and application data (`DataProvider`).

## Key Features:

*   **Transaction Management:**
    *   Add, update, and delete income and expense transactions.
    *   Categorize transactions (e.g., Food, Travel, Salary).
    *   View a list of recent transactions.
*   **Budgeting:**
    *   Create, update, and delete budgets for specific categories or all categories.
    *   Set budget amounts and time periods (start and end dates).
    *   Track spending against budgets and view progress.
    *   View active and past budgets.
*   **Dashboard & Visualization:**
    *   **Summary:** View total income, expenses, and balance for selected time filters (daily, weekly, monthly, yearly).
    *   **Expense Chart:** A pie chart visualizing expense breakdown by category for the selected time filter.
    *   **Budget Progress:** Displays progress for the primary active spending goal/budget.
*   **Data Management:**
    *   Local data storage using SQLite.
    *   Ability to export data.
    *   Default categories are pre-populated on first launch.
*   **Theming:** Supports light and dark themes.

## Project Structure Overview:

*   **`app/`**: Contains the application screens and navigation logic, managed by Expo Router.
    *   **`_layout.tsx`**: The root layout component. It initializes fonts, the database, and sets up global providers.
    *   **`(tabs)/`**: Defines the tab-based navigation structure.
        *   **`index.tsx`**: The main Dashboard screen.
        *   **`budgets.tsx`**: The screen for managing budgets.
*   **`components/`**: Reusable UI components.
    *   **`dashboard/`**: Components specific to the Dashboard screen (e.g., `DashboardSummary.tsx`, `ExpenseChart.tsx`).
    *   **`budget/`**: Components related to budget management (e.g., `BudgetProgress.tsx`, `BudgetForm.tsx`).
*   **`context/`**: React Context providers for global state management.
    *   **`ThemeContext.tsx`**: Manages the application's theme.
    *   **`DataContext.tsx`**: Manages financial data and interactions with the database.
*   **`constants/`**: Application-wide constants (e.g., theme values).
*   **`hooks/`**: Custom React hooks.
*   **`services/`**: Modules for external services.
    *   **`database.ts`**: Handles all SQLite database interactions.
*   **`assets/`**: Static assets like images and fonts.
*   **`app.json`**: Expo configuration file.
*   **`package.json`**: Project dependencies and scripts.
*   **`tsconfig.json`**: TypeScript configuration file.

## Data Flow and Management:

1.  **Initialization:**
    *   On app startup, `app/_layout.tsx` initializes the SQLite database via `services/database.ts`.
    *   The `SplashScreen` is managed until initial resources are ready.
2.  **Data Provider (`context/DataContext.tsx`):**
    *   Loads and manages all financial data (transactions, categories, budgets) from the database.
    *   Provides functions for CRUD operations and data processing.
3.  **UI Components:**
    *   Consume data and functions from `DataContext` using the `useData` hook.

## Android Build Configuration:

*   The app uses ProGuard for release build minification.
*   Signing configurations for debug and release builds are managed via `android/app/build.gradle` and `android/gradle.properties`.
*   React Native's New Architecture (TurboModules and Fabric) is enabled.
*   Hermes JavaScript engine is enabled.
*   `expo-sqlite` is configured with SQLCipher options (though disabled for Android in `app.json`).

### Android ProGuard Rules

The following ProGuard rules are applied to Android release builds to ensure proper functionality of specific libraries after code minification and obfuscation. These rules are located in `android/app/proguard-rules.pro`.

```proguard
# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# expo-sqlite
-keep class expo.modules.sqlite.** { *; }
# Add any project specific keep options here:
```