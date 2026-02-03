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
import { validateLoginForm } from '@/utils/validation';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(async () => {
    // Validate form
    const { isValid, errors: validationErrors } = validateLoginForm(email, password);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors
    setErrors({});

    try {
      await login(email, password);
      // Navigation handled by auth state in root layout
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      Alert.alert('Login Error', errorMessage);
    }
  }, [email, password, login]);

  const handleForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/sign-up');
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
            <ThemedText style={styles.title}>Campus Companion</ThemedText>
            <ThemedText style={styles.subtitle}>Welcome Back</ThemedText>
            <ThemedText style={styles.description}>
              Sign in to access campus events and manage your reminders
            </ThemedText>
          </View>

          {/* Form Section */}
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

            <View style={styles.passwordField}>
              <ThemedTextInput
                testID="password-input"
                label="Password"
                placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              testID="forgot-password-link"
            >
              <ThemedText style={styles.forgotLink}>Forgot password?</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            testID="login-button"
            label="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Sign in to your account"
          />

          {/* Sign Up Link */}
          <View style={styles.signUpSection}>
            <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
            <TouchableOpacity
              onPress={handleSignUp}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Create new account"
              testID="sign-up-link"
            >
              <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
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
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
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
  forgotLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
    textAlign: 'right',
    marginTop: 12,
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    opacity: 0.7,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a7ea4',
  },
});
