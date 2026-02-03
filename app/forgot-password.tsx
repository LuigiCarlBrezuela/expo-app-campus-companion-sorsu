import React, { useState, useCallback } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import { isValidEmail } from '@/utils/validation';

type Step = 'email' | 'verification' | 'reset';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = useCallback(async () => {
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!isValidEmail(email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        'Check Your Email',
        'We sent a verification code to your email address.',
        [{ text: 'OK', onPress: () => setStep('verification') }]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send reset link.';
      Alert.alert('Error', errorMessage);
    }
  }, [email, resetPassword]);

  const handleVerificationSubmit = useCallback(() => {
    setErrors({});

    if (!verificationCode.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    if (verificationCode.length !== 6) {
      setErrors({ code: 'Verification code must be 6 digits' });
      return;
    }

    // Move to password reset step
    setStep('reset');
  }, [verificationCode]);

  const handlePasswordReset = useCallback(async () => {
    setErrors({});

    if (!newPassword) {
      setErrors({ password: 'Password is required' });
      return;
    }

    if (newPassword.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Your password has been reset. Please log in again.', [
        {
          text: 'OK',
          onPress: () => router.push('/login'),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password.';
      Alert.alert('Error', errorMessage);
    }
  }, [newPassword, confirmPassword, router]);

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
          {/* Header */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => router.back()}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Go back"
              testID="back-button"
            >
              <ThemedText style={styles.backButton}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>Reset Password</ThemedText>
            <ThemedText style={styles.description}>
              {step === 'email' && 'Enter your email to receive a verification code'}
              {step === 'verification' && 'Enter the code sent to your email'}
              {step === 'reset' && 'Create a new password for your account'}
            </ThemedText>
          </View>

          {/* Email Step */}
          {step === 'email' && (
            <View style={styles.formSection}>
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
              <Button
                testID="send-code-button"
                label="Send Code"
                onPress={handleEmailSubmit}
                loading={isLoading}
                disabled={isLoading}
                accessibilityLabel="Send verification code to email"
              />
            </View>
          )}

          {/* Verification Step */}
          {step === 'verification' && (
            <View style={styles.formSection}>
              <ThemedTextInput
                testID="code-input"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                error={errors.code}
              />
              <Button
                testID="verify-code-button"
                label="Verify Code"
                onPress={handleVerificationSubmit}
                loading={isLoading}
                disabled={isLoading}
                accessibilityLabel="Verify the code sent to your email"
              />
            </View>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <View style={styles.formSection}>
              <View style={styles.passwordField}>
                <ThemedTextInput
                  testID="password-input"
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
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

              <ThemedTextInput
                testID="confirm-password-input"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
              />

              <Button
                testID="reset-password-button"
                label="Reset Password"
                onPress={handlePasswordReset}
                loading={isLoading}
                disabled={isLoading}
                accessibilityLabel="Reset your password"
              />
            </View>
          )}
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
    paddingVertical: 16,
  },
  headerSection: {
    marginBottom: 40,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
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
});
