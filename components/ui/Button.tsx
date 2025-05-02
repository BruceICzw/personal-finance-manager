import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SIZES } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon
}) => {
  const { theme } = useTheme();
  
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.radiusMd,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };
    
    // Size variations
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'sm':
        sizeStyle = {
          paddingVertical: SIZES.spacing,
          paddingHorizontal: SIZES.spacing * 1.5,
        };
        break;
      case 'lg':
        sizeStyle = {
          paddingVertical: SIZES.spacing * 1.5,
          paddingHorizontal: SIZES.spacing * 3,
        };
        break;
      default: // 'md'
        sizeStyle = {
          paddingVertical: SIZES.spacing * 1.25,
          paddingHorizontal: SIZES.spacing * 2,
        };
    }
    
    // Variant styles
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'secondary':
        variantStyle = {
          backgroundColor: theme.colors.secondary,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: theme.colors.error,
        };
        break;
      default: // 'primary'
        variantStyle = {
          backgroundColor: theme.colors.primary,
        };
    }
    
    // Full width style
    const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...widthStyle,
    };
  };
  
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };
    
    // Size variations
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'sm':
        sizeStyle = {
          fontSize: SIZES.sm,
        };
        break;
      case 'lg':
        sizeStyle = {
          fontSize: SIZES.lg,
        };
        break;
      default: // 'md'
        sizeStyle = {
          fontSize: SIZES.md,
        };
    }
    
    // Color based on variant
    let colorStyle: TextStyle = {};
    switch (variant) {
      case 'outline':
      case 'ghost':
        colorStyle = {
          color: theme.colors.primary,
        };
        break;
      default:
        colorStyle = {
          color: 'white',
        };
    }
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...colorStyle,
    };
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : 'white'} 
          size={size === 'sm' ? 'small' : 'small'} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyles(), icon ? { marginLeft: SIZES.spacing } : {}, textStyle]}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;