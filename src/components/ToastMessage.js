import React from 'react';
import '../css/toast-message.css'; 

export default function ToastMessage({ show, message, onClick, id }) {
  return (
    <div 
      id={id}
      className={`toast-complete-wrapper ${show ? '' : 'hidden'}`} 
    >
      {onClick ? (
        <button 
          type="button" 
          id="btnToastConfirm" 
          onClick={onClick}
        >
          {message}
        </button>
      ) : (
        <div className="btn-toast-purple">
          {message}
        </div>
      )}
    </div>
  );
}
