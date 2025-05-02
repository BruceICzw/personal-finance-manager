import React, { forwardRef, useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Platform, 
  ViewStyle, 
  TextStyle,
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SIZES } from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helper,
  containerStyle,
  inputStyle,
  labelStyle,
  placeholder,
  icon,
  rightIcon,
  secureTextEntry,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [secureEntry, setSecureEntry] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setSecureEntry(!secureEntry);
  };

  // Render secure text entry toggle icon for password fields
  const renderSecureTextIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIconContainer}>
          {secureEntry ? (
            <EyeOff size={18} color={theme.colors.text} />
          ) : (
            <Eye size={18} color={theme.colors.text} />
          )}
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          style={[
            styles.label, 
            { color: theme.colors.text }, 
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: error 
            ? theme.colors.error 
            : focused 
              ? theme.colors.primary 
              : theme.colors.border,
          borderWidth: focused || error ? 2 : 1,
        }
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              paddingLeft: icon ? 0 : SIZES.spacing * 1.5,
              paddingRight: (rightIcon || secureTextEntry) ? 40 : SIZES.spacing * 1.5,
            },
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.border}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureEntry}
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        {renderSecureTextIcon()}
      </View>
      
      {(error || helper) && (
        <Text style={[
          styles.helperText,
          { color: error ? theme.colors.error : theme.colors.text }
        ]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing * 2,
  },
  label: {
    marginBottom: SIZES.spacing,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
  },
  iconContainer: {
    paddingHorizontal: SIZES.spacing * 1.5,
  },
  rightIconContainer: {
    position: 'absolute',
    right: SIZES.spacing * 1.5,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? SIZES.spacing * 1.5 : SIZES.spacing,
    fontSize: SIZES.md,
  },
  helperText: {
    marginTop: SIZES.spacing / 2,
    fontSize: SIZES.xs,
  }
});

export default Input;