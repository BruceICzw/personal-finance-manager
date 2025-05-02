import { Platform } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const COLORS = {
  // Primary - Forest Green (Income)
  primary50: '#ecfdf5',
  primary100: '#d1fae5',
  primary200: '#a7f3d0',
  primary300: '#6ee7b7',
  primary400: '#34d399',
  primary500: '#10b981',
  primary600: '#059669',
  primary700: '#047857',
  primary800: '#065f46',
  primary900: '#064e3b',

  // Secondary - Coral Red (Expenses)
  secondary50: '#fff1f2',
  secondary100: '#ffe4e6',
  secondary200: '#fecdd3',
  secondary300: '#fda4af',
  secondary400: '#fb7185',
  secondary500: '#f43f5e',
  secondary600: '#e11d48',
  secondary700: '#be123c',
  secondary800: '#9f1239',
  secondary900: '#881337',

  // Accent - Blue
  accent50: '#eff6ff',
  accent100: '#dbeafe',
  accent200: '#bfdbfe',
  accent300: '#93c5fd',
  accent400: '#60a5fa',
  accent500: '#3b82f6',
  accent600: '#2563eb',
  accent700: '#1d4ed8',
  accent800: '#1e40af',
  accent900: '#1e3a8a',

  // Neutrals
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Miscellaneous
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const SIZES = {
  // Font Sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  xxxxl: 36,

  // Spacing
  spacing: 8,
  
  // Border Radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  
  // Shadows
  shadowSm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
    web: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
  }),
  shadowMd: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    android: {
      elevation: 4,
    },
    web: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  }),
  shadowLg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
    },
    android: {
      elevation: 10,
    },
    web: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
    },
  }),
};

export const lightTheme = {
  colors: {
    background: COLORS.neutral50,
    card: COLORS.white,
    text: COLORS.neutral900,
    border: COLORS.neutral200,
    notification: COLORS.secondary500,
    primary: COLORS.primary600,
    secondary: COLORS.secondary600,
    accent: COLORS.accent500,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info,
    incomeText: COLORS.primary700,
    expenseText: COLORS.secondary700,
    cardBackground: COLORS.white,
    inputBackground: COLORS.neutral100,
    backdrop: COLORS.backdrop
  },
};

export const darkTheme = {
  colors: {
    background: COLORS.neutral900,
    card: COLORS.neutral800,
    text: COLORS.neutral50,
    border: COLORS.neutral700,
    notification: COLORS.secondary400,
    primary: COLORS.primary400,
    secondary: COLORS.secondary400,
    accent: COLORS.accent400,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info,
    incomeText: COLORS.primary300,
    expenseText: COLORS.secondary300,
    cardBackground: COLORS.neutral800,
    inputBackground: COLORS.neutral700,
    backdrop: COLORS.backdrop,
  },
};