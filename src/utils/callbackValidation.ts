/**
 * Validates standard phone format.
 */
export function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validates email format syntax.
 */
export function validateEmail(email?: string): boolean {
  if (!email) return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Common validation checker for callback request inputs.
 */
export function validateCallbackRequest(fullName: string, phoneNumber: string): { valid: boolean; error?: string } {
  if (!fullName || !fullName.trim()) {
    return { valid: false, error: 'Full name is required' };
  }
  if (!phoneNumber || !phoneNumber.trim()) {
    return { valid: false, error: 'Phone number is required' };
  }
  if (!validatePhoneNumber(phoneNumber)) {
    return { valid: false, error: 'Please enter a valid 10-15 digit phone number' };
  }
  return { valid: true };
}
