// Returns an error string or null if valid

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) return `${fieldName} is required.`;
  return null;
};

export const validateMinLength = (
  value: string,
  min: number,
  fieldName: string
): string | null => {
  if (value.trim().length < min)
    return `${fieldName} must be at least ${min} characters.`;
  return null;
};

export const validateMaxLength = (
  value: string,
  max: number,
  fieldName: string
): string | null => {
  if (value.trim().length > max)
    return `${fieldName} must be no more than ${max} characters.`;
  return null;
};

// Combines required + min + max in one call
export const validateTextField = (
  value: string,
  fieldName: string,
  min = 2,
  max = 100
): string | null => {
  return (
    validateRequired(value, fieldName) ||
    validateMinLength(value, min, fieldName) ||
    validateMaxLength(value, max, fieldName)
  );
};