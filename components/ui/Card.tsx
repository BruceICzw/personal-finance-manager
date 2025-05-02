import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SIZES } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
  elevation?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  noPadding = false,
  elevation = 'medium'
}) => {
  const { theme, colorScheme } = useTheme();

  const getElevationStyle = () => {
    if (elevation === 'none') return {};
    
    if (colorScheme === 'dark') {
      // Dark mode uses border instead of shadow for better visibility
      return {
        borderWidth: elevation === 'small' ? 1 : elevation === 'medium' ? 1 : 2,
        borderColor: theme.colors.border,
      };
    }
    
    // Light mode uses shadows
    switch (elevation) {
      case 'small':
        return SIZES.shadowSm;
      case 'large':
        return SIZES.shadowLg;
      case 'medium':
      default:
        return SIZES.shadowMd;
    }
  };

  return (
    <View
      style={[
        styles.card,
        noPadding ? {} : styles.padding,
        { backgroundColor: theme.colors.cardBackground, borderRadius: SIZES.radiusLg },
        getElevationStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  padding: {
    padding: SIZES.spacing * 2,
  }
});

export default Card;