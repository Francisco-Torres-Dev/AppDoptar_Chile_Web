// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function isStrongPassword(password: string): boolean {
  return password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /[0-9]/.test(password);
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm && password.length > 0;
}

// Basic validation
export function required(value: string | number | undefined): boolean {
  if (typeof value === 'number') return true;
  return value?.toString().trim().length > 0 ?? false;
}

export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function maxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

// Phone validation (Chilean format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+56)?[\d\s\-\+]{8,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Number validation
export function isValidNumber(value: string | number): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value));
}

// Currency validation (Chilean Peso)
export function isValidAmount(amount: string | number): boolean {
  const num = Number(amount);
  return num > 0 && num <= 999999999 && !isNaN(num);
}

// Date validation
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Age validation
export function isValidAge(age: number): boolean {
  return age >= 13 && age <= 120;
}

// Combined validation with error messages
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!required(email)) {
    errors.email = 'El correo es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!required(password)) {
    errors.password = 'La contraseña es requerida';
  } else if (!minLength(password, 6)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone?: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!required(firstName)) {
    errors.firstName = 'El nombre es requerido';
  } else if (!minLength(firstName, 2)) {
    errors.firstName = 'El nombre debe tener al menos 2 caracteres';
  } else if (maxLength(firstName, 50)) {
    errors.firstName = 'El nombre no puede exceder 50 caracteres';
  }

  if (!required(lastName)) {
    errors.lastName = 'El apellido es requerido';
  } else if (!minLength(lastName, 2)) {
    errors.lastName = 'El apellido debe tener al menos 2 caracteres';
  }

  if (!required(email)) {
    errors.email = 'El correo es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!required(password)) {
    errors.password = 'La contraseña es requerida';
  } else if (!minLength(password, 8)) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (!isStrongPassword(password)) {
    errors.password = 'La contraseña debe incluir mayúsculas, minúsculas y números';
  }

  if (!passwordsMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Ingresa un teléfono válido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCampaignForm(
  title: string,
  description: string,
  goalAmount: number | string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!required(title)) {
    errors.title = 'El título es requerido';
  } else if (!minLength(title, 5)) {
    errors.title = 'El título debe tener al menos 5 caracteres';
  } else if (maxLength(title, 100)) {
    errors.title = 'El título no puede exceder 100 caracteres';
  }

  if (!required(description)) {
    errors.description = 'La descripción es requerida';
  } else if (!minLength(description, 20)) {
    errors.description = 'La descripción debe tener al menos 20 caracteres';
  }

  if (!isValidAmount(goalAmount)) {
    errors.goalAmount = 'Ingresa una cantidad válida mayor a $0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
