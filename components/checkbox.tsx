import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onPress,
  label,
  children,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID}
      accessible
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? '#0a7ea4' : 'white',
            borderColor: checked ? '#0a7ea4' : '#cccccc',
          },
        ]}
      >
        {checked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </View>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
});
