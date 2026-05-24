import { useState } from 'react';

type ValidationRules<T> = Partial<Record<keyof T, (value: string) => string | null>>;

const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Update a single field value
  const handleChange = (field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Mark field as touched on blur
  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validationRules?.[field]) {
      const error = validationRules[field]!(values[field] ?? '');
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Validate all fields — returns true if valid
  const validate = (): boolean => {
    if (!validationRules) return true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field in validationRules) {
      const error = validationRules[field]!(values[field] ?? '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // Reset form to initial values
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, validate, reset, setValues };
};

export default useForm;