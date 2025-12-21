import { useState, useCallback } from 'react';


export const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Field değiştiğinde hatayı temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback((onSubmit) => {
    return async () => {
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      if (validateForm()) {
        await onSubmit(values);
      }
    };
  }, [values, validateForm]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateForm,
    isValid
  };
};

// Yaygın validasyon kuralları
export const validators = {
  required: (value, fieldName = 'Bu alan') => 
    !value || value.trim() === '' ? `${fieldName} gereklidir` : null,
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Geçerli bir e-posta adresi giriniz' : null;
  },
  
  minLength: (min) => (value, fieldName = 'Bu alan') =>
    value && value.length < min ? `${fieldName} en az ${min} karakter olmalıdır` : null,
  
  maxLength: (max) => (value, fieldName = 'Bu alan') =>
    value && value.length > max ? `${fieldName} en fazla ${max} karakter olmalıdır` : null,
  
  match: (matchValue, fieldName = 'Değerler') =>
    (value) => value !== matchValue ? `${fieldName} eşleşmiyor` : null,
  
  phone: (value) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return value && !phoneRegex.test(value.replace(/\D/g, '')) 
      ? 'Geçerli bir telefon numarası giriniz' 
      : null;
  }
};

export default useForm;
