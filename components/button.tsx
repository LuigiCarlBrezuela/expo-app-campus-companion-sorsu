import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemedText } from './themed-text';

interface ButtonProps {
  onPress: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'large' | 'medium' | 'small';
  backgroundColor?: string;
  testID?: string;
  accessibilityLabel?: string;
}

export function Button({
  onPress,
  label,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'large',
  backgroundColor,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      opacity: isDisabled ? 0.6 : 1,
    };

    let sizeStyle: ViewStyle = { height: 54, paddingHorizontal: 20 };
    if (size === 'medium') {
      sizeStyle = { height: 48, paddingHorizontal: 16 };
    } else if (size === 'small') {
      sizeStyle = { height: 40, paddingHorizontal: 12 };
    }

    let variantStyle: ViewStyle = {};
    if (variant === 'primary') {
      variantStyle = {
        backgroundColor: backgroundColor || '#0a7ea4',
      };
    } else if (variant === 'secondary') {
      variantStyle = {
        backgroundColor: '#f0f0f0',
      };
    } else if (variant === 'outline') {
      variantStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#0a7ea4',
      };
    }

    return { ...baseStyle, ...sizeStyle, ...variantStyle };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700',
    };

    let sizeStyle: TextStyle = { fontSize: 16 };
    if (size === 'medium') {
      sizeStyle = { fontSize: 14 };
    } else if (size === 'small') {
      sizeStyle = { fontSize: 12 };
    }

    let variantStyle: TextStyle = {};
    if (variant === 'primary') {
      variantStyle = { color: 'white' };
    } else if (variant === 'secondary') {
      variantStyle = { color: '#11181C' };
    } else if (variant === 'outline') {
      variantStyle = { color: '#0a7ea4' };
    }

    return { ...baseStyle, ...sizeStyle, ...variantStyle };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#0a7ea4'} size="small" />
      ) : (
        <ThemedText style={getTextStyle()}>{label}</ThemedText>
      )}
    </TouchableOpacity>
  );
}
