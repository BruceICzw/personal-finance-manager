import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/theme';

type ThemeContextType = {
  theme: typeof lightTheme;
  colorScheme: 'light' | 'dark';
  userTheme: 'light' | 'dark' | 'system';
  setUserTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  colorScheme: 'light',
  userTheme: 'system',
  setUserTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as 'light' | 'dark';
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme) {
          setUserTheme(savedTheme as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);

  // Update color scheme based on user theme preference
  useEffect(() => {
    const newColorScheme = userTheme === 'system' 
      ? systemColorScheme || 'light'
      : userTheme;
    
    setColorScheme(newColorScheme);
  }, [userTheme, systemColorScheme]);

  // Save user theme preference
  const handleSetUserTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
      setUserTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const contextValue = {
    theme,
    colorScheme,
    userTheme,
    setUserTheme: handleSetUserTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);