/**
 * Email validation utility
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password strength validation
 * Returns object with validation details
 */
export const validatePassword = (password: string) => {
  return {
    isLengthValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

/**
 * Get password strength level (0-4)
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  const validation = validatePassword(password);
  let strength = 0;

  if (validation.isLengthValid) strength++;
  if (validation.hasUpperCase && validation.hasLowerCase) strength++;
  if (validation.hasNumber) strength++;
  if (validation.hasSpecialChar) strength++;

  return Math.min(strength, 4);
};

/**
 * Get password strength label and color
 */
export const getPasswordStrengthLabel = (strength: number) => {
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['#ff4444', '#ff8844', '#ffbb33', '#88cc00', '#00c850'];

  return {
    label: labels[strength] || 'Weak',
    color: colors[strength] || '#ff4444',
  };
};

/**
 * Name validation
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Form field validation
 */
export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignUpForm = (email: string, password: string, name: string) => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (!isValidName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
