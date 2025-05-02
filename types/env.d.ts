declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_APP_VERSION: string;
      // Add other environment variables here if needed
    }
  }
}

// Ensure this file is treated as a module
export {};