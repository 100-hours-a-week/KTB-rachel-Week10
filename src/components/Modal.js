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

  // 모달 오픈 상태 변화에 따라 Native HTML5 dialog 제어
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

  // 뒷배경(Overlay) 영역 클릭 시 모달이 닫히도록 지원
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
          {/* 취소 버튼 (.btn-cancel 특화 클래스 추가 적용) */}
          <button 
            type="button" 
            className="btn-save btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          
          {/* 확인/작업 버튼 (isDanger 여부에 따라 클래스 분기) */}
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
