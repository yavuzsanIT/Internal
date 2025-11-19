import React from 'react';
import '../styles/Alert.css';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ⓘ'}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      <button className="alert-close" onClick={onClose} aria-label="Close alert">
        ×
      </button>
    </div>
  );
};
