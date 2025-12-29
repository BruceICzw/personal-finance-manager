# Wealth Wise - Personal Finance Manager [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/BruceICzw/personal-finance-manager)

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

# Setup Guide
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Expo CLI: `npm install -g expo-cli`
*   Git
*   A code editor (e.g., Visual Studio Code)
*   An Android Emulator/Device or iOS Simulator/Device

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BruceICzw/personal-finance-manager
    cd personal-finance-manager
    ```
2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

### Running the Application

1.  **Start the Metro Bundler:**
    Using npm:
    ```bash
    npm start
    ```
    Or using Yarn:
    ```bash
    yarn start
    ```
    This will open the Expo Developer Tools in your web browser.

2.  **Run on a device/emulator:**
    *   **Android:**
        *   Ensure you have an Android emulator running or a physical device connected with USB debugging enabled.
        *   In the Expo Developer Tools, click "Run on Android device/emulator" or press `a` in the terminal.
    *   **iOS (macOS only):**
        *   Ensure you have Xcode installed and an iOS simulator running or a physical device connected.
        *   In the Expo Developer Tools, click "Run on iOS simulator" or press `i` in the terminal.
    *   **Expo Go App:**
        *   Install the "Expo Go" app on your physical Android or iOS device.
        *   Scan the QR code displayed in the Expo Developer Tools or the terminal using the Expo Go app.

## Building for Production

Expo offers different ways to build your app for production. EAS Build is generally recommended for its ease of use and cloud features. Alternatively, you can perform manual local builds.

### Android (`.apk` or `.aab`)

#### 1. EAS Build (Recommended)

Expo Application Services (EAS) is the modern way to build your app.

*   **Install EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```
*   **Login to your Expo account:**
    ```bash
    eas login
    ```
*   **Configure your project for EAS Build (if not done already):**
    ```bash
    eas build:configure
    ```
*   **Start the build:**
    For a development/test build (e.g., for internal distribution):
    ```bash
    eas build -p android --profile preview
    ```
    For a production release build (e.g., for app stores):
    ```bash
    eas build -p android --profile production
    ```
*   Follow the prompts. Builds are performed on Expo's servers. For production builds, ensure your EAS project is configured with your Android Keystore. Refer to the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/) for full details.

#### 2. Manual Local Android Build

This process involves generating the native Android project files and building them locally using Gradle.

1.  **Prebuild the Native Project:**
    If you haven't already, or if you need to sync changes from your Expo config, generate/update the native `android` directory:
    ```bash
    npx expo prebuild
    ```
    This command might ask for your Android package name if it's not already defined in `app.json`.

2.  **Generate a Release Keystore:**
    If you don't have a release keystore (`.jks` file), create one using the `keytool` command (typically found in your Java JDK's `bin` directory):
    ```bash
    keytool -genkeypair -v -keystore your_app_name-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias your_key_alias
    ```
    Replace `your_app_name-release-key.jks` and `your_key_alias` with your desired filenames and alias. You will be prompted to create passwords for the keystore and the key. **Store this keystore file securely and back it up.**

3.  **Configure Keystore in `gradle.properties`:**
    Place your generated `.jks` file in the `android/app` directory (or another secure location). Then, update (or create if it doesn't exist) the `android/gradle.properties` file with your keystore credentials:
    ```java-properties
    // filepath: c:\Users\HP\Downloads\personal-finance-manager\android\gradle.properties
    // ...existing code...
    MYAPP_UPLOAD_STORE_FILE=your_app_name-release-key.jks
    MYAPP_UPLOAD_KEY_ALIAS=your_key_alias
    MYAPP_UPLOAD_STORE_PASSWORD=your_keystore_password
    MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
    // ...existing code...
    ```
    Replace the placeholder values with your actual keystore filename, alias, and passwords.

4.  **Configure Signing in `android/app/build.gradle`:**
    Ensure your `android/app/build.gradle` file is set up to use these properties for release signing. The `signingConfigs` block should include a `release` configuration:
    ```gradle
    // filepath: c:\Users\HP\Downloads\personal-finance-manager\android\app\build.gradle
    // ...existing code...
    android {
        // ...existing code...
        signingConfigs {
            debug {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
            release {
                if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                    storeFile file(MYAPP_UPLOAD_STORE_FILE)
                    storePassword MYAPP_UPLOAD_STORE_PASSWORD
                    keyAlias MYAPP_UPLOAD_KEY_ALIAS
                    keyPassword MYAPP_UPLOAD_KEY_PASSWORD
                }
            }
        }
        buildTypes {
            release {
                // ...existing code...
                signingConfig signingConfigs.release
                // Ensure ProGuard/R8 is enabled for release builds
                // The actual property might be `enableProguardInReleaseBuilds` from react.gradle
                minifyEnabled true 
                proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            }
        }
        // ...existing code...
    }
    // ...existing code...
    ```

5.  **Update ProGuard Rules (`android/app/proguard-rules.pro`):**
    Ensure your `android/app/proguard-rules.pro` file contains necessary rules for libraries like `expo-sqlite`. A rule like the following should be present:
    ```proguard
    // filepath: c:\Users\HP\Downloads\personal-finance-manager\android\app\proguard-rules.pro
    // ...existing code...
    # expo-sqlite
    -keep class expo.modules.sqlite.** { *; }
    // ...existing code...
    ```
    Add any other project-specific ProGuard rules as needed.

6.  **Check Android Manifest (`android/app/src/main/AndroidManifest.xml`):**
    Verify that all required permissions for your app are declared in your `android/app/src/main/AndroidManifest.xml` file.
    ```xml
    // filepath: c:\Users\HP\Downloads\personal-finance-manager\android\app\src\main\AndroidManifest.xml
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        // ...
        <uses-permission android:name="android.permission.INTERNET"/>
        // Add other permissions your app requires, e.g.:
        // <uses-permission android:name="android.permission.CAMERA"/>
        // ...
    </manifest>
    ```

7.  **Assemble the Release Build:**
    Navigate to the `android` directory in your project's root and run the Gradle `assembleRelease` task:
    ```bash
    cd android
    ./gradlew assembleRelease 
    ```
    (On Windows, you might just run `gradlew assembleRelease` from the `android` directory).

8.  **Install and Test the APK:**
    After a successful build, the release APK will typically be located at `android/app/build/outputs/apk/release/app-release.apk`.
    You can install it on an Android device or emulator using ADB (Android Debug Bridge):
    ```bash
    adb install app/build/outputs/apk/release/app-release.apk
    ```
    To view logs from your device/emulator while testing:
    ```bash
    adb logcat
    ```

### iOS (`.ipa`)

1.  **Configure `app.json`:**
    Ensure your `app.json` file has the correct `ios.bundleIdentifier` and other necessary configurations. You'll need an Apple Developer account and to set up provisioning profiles and certificates.
2.  **Build with EAS Build (Recommended):**
    *   Similar to Android, use EAS CLI:
        ```bash
        eas build -p ios --profile preview
        eas build -p ios --profile production
        ```
    EAS Build will handle the complexities of iOS code signing if your EAS project and Apple Developer account are configured correctly. Refer to the [Expo EAS Build for iOS documentation](https://docs.expo.dev/build/ios/) for details.

Refer to the official [Expo documentation](https://docs.expo.dev/) for the most up-to-date and detailed instructions on development, building, and deployment.
```
