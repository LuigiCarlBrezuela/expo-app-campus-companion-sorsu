import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedTextInput } from '@/components/themed-text-input';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { useAuth } from '@/hooks/use-auth';
import {
  validateSignUpForm,
  getPasswordStrength,
  getPasswordStrengthLabel,
} from '@/utils/validation';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Calculate password strength
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel = useMemo(
    () => getPasswordStrengthLabel(passwordStrength),
    [passwordStrength]
  );

  const handleSignUp = useCallback(async () => {
    // Validate form
    const { isValid, errors: validationErrors } = validateSignUpForm(email, password, name);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions to continue.');
      return;
    }

    setErrors({});

    try {
      await signUp(email, password, name);
      // Navigation handled by auth state in root layout
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign up failed. Please try again.';
      Alert.alert('Sign Up Error', errorMessage);
    }
  }, [email, password, confirmPassword, name, agreedToTerms, signUp]);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join Campus Companion</ThemedText>
            <ThemedText style={styles.description}>
              Create an account to get started with campus events and reminders
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <ThemedTextInput
              testID="name-input"
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />

            <ThemedTextInput
              testID="email-input"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
              autoCapitalize="none"
            />

            {/* Password Input */}
            <View style={styles.passwordField}>
              <ThemedTextInput
                testID="password-input"
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                accessible
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                testID="toggle-password-visibility"
              >
                <ThemedText style={styles.passwordToggleText}>
                  {showPassword ? 'Hide' : 'Show'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthSection}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${(passwordStrength + 1) * 25}%`,
                        backgroundColor: strengthLabel.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.strengthLabel, { color: strengthLabel.color }]}>
                  Password strength: {strengthLabel.label}
                </ThemedText>
              </View>
            )}

            {/* Confirm Password Input */}
            <ThemedTextInput
              testID="confirm-password-input"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              error={errors.confirmPassword}
            />
          </View>

          {/* Terms Section */}
          <View style={styles.termsSection}>
            <Checkbox
              testID="terms-checkbox"
              checked={agreedToTerms}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              accessibilityLabel="Accept terms and conditions"
            >
              <ThemedText style={styles.termsText}>
                I agree to the{' '}
                <ThemedText style={styles.termsLink}>Terms of Service</ThemedText> and{' '}
                <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
              </ThemedText>
            </Checkbox>
          </View>

          {/* Sign Up Button */}
          <Button
            testID="sign-up-button"
            label="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Create your account"
          />

          {/* Login Link */}
          <View style={styles.loginSection}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity
              onPress={handleLogin}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Sign in to your account"
              testID="sign-in-link"
            >
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  formSection: {
    marginBottom: 24,
  },
  passwordField: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  passwordToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  strengthSection: {
    marginTop: -8,
    marginBottom: 16,
  },
  strengthBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  termsSection: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '700',
    color: '#0a7ea4',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a7ea4',
  },
});
