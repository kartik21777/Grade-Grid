import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ isVisible, message, type, onConfirm, onCancel, onClose }) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'confirm': return '❓';
      default: return 'ℹ️';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'alertBackdrop') {
      if (type !== 'confirm') onClose();
    }
  };

  return (
    <div className="alertBackdrop" onClick={handleBackdropClick}>
      <div className={`alertModal ${type}`}>
        <div className="alertIcon">{getIcon()}</div>
        <div className="alertContent">
          <p className="alertMessage">{message}</p>
        </div>
        <div className="alertActions">
          {type === 'confirm' ? (
            <>
              <button className="alertBtn cancelBtn" onClick={onCancel}>Cancel</button>
              <button className="alertBtn confirmBtn" onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="alertBtn okBtn" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
