import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from '../components/common/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    type: 'info', // info, success, error, confirm
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = useCallback((message, type = 'info') => {
    setAlert({
      isVisible: true,
      message,
      type,
      onConfirm: null,
      onCancel: null,
    });
  }, []);

  const showConfirm = useCallback((message, onConfirm, onCancel) => {
    setAlert({
      isVisible: true,
      message,
      type: 'confirm',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        hideAlert();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        hideAlert();
      },
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
      {children}
      <CustomAlert 
        isVisible={alert.isVisible} 
        message={alert.message} 
        type={alert.type} 
        onConfirm={alert.onConfirm} 
        onCancel={alert.onCancel}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};
