import { useState, useCallback } from 'react';

export const useToast = (defaultDuration = 3000) => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
    duration: defaultDuration
  });

  const showToast = useCallback((message, type = 'success', duration = defaultDuration) => {
    setToast({
      visible: true,
      message,
      type,
      duration
    });
  }, [defaultDuration]);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      visible: false,
      message: ''
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
    toastProps: {
      visible: toast.visible,
      message: toast.message,
      type: toast.type,
      duration: toast.duration,
      onHide: hideToast
    }
  };
};

export default useToast;
