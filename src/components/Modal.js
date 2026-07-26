import React, { useEffect, useRef } from 'react';
import '../css/modal.css'; 


export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = "확인",
  cancelText = "취소",
  isDanger = false
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <div 
      className={`modal-overlay ${isOpen ? '' : 'hidden'}`} 
      onClick={handleOverlayClick}
    >
      <dialog 
        ref={dialogRef}
        className="modal-content" 
        onClose={onClose}
      >
        <h2 className="modal-title">
          {title}
        </h2>
        
        {subtitle && (
          <p className="modal-subtitle">
            {subtitle}
          </p>
        )}
        
        <div className="modal-actions">
          {/* 취소 버튼 */}
          <button 
            type="button" 
            className="btn-save btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          
          {/* 확인/작업 버튼 */}
          <button 
            type="button" 
            className={isDanger ? "btn-withdraw" : "btn-save"} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </dialog>
    </div>
  );
}
