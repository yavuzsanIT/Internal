import { useState, useCallback } from 'react';

export interface Alert {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useAlert = () => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};
