import { TextInput as RNTextInput, View, StyleSheet, useColorScheme as useRNColorScheme } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';

interface ThemedTextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  error?: string;
  testID?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function ThemedTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  error,
  testID,
  autoCapitalize = 'none',
}: ThemedTextInputProps) {
  const colorScheme = useRNColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme as 'light' | 'dark'] || Colors.light;

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <RNTextInput
        testID={testID}
        style={[
          styles.input,
          {
            borderColor: error ? '#ff4444' : theme.icon,
            backgroundColor: theme.background,
            color: theme.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.icon}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize={autoCapitalize}
        accessible
        accessibilityLabel={label}
        accessibilityHint={error || placeholder}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 6,
  },
});
