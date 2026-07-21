import React, { useEffect, useRef } from 'react';
import '../css/modal.css'; // [수정 내용 주석] 공통 모달 스타일 파일 임포트

/**
 * Modal — 공통 모달 팝업 컴포넌트
 * 
 * [수정 내용 주석]
 * - HTML5 <dialog> 요소를 활용하여 배경 차단(Backdrop)과 Esc 키 기본 제어를 지원합니다.
 * - 댓글 수정, 삭제 확인, 회원 탈퇴 등 다양한 컨텍스트에서 재사용이 가능하도록 타이틀, 서브타이틀, 버튼 콜백 등을 속성(Props)으로 받도록 하였습니다.
 * - 위험 작업(삭제, 탈퇴 등)을 구분하여 빨간색 버튼(.btn-withdraw)과 일반 파란색 버튼(.btn-save)을 동적으로 제어할 수 있도록 isDanger 프롭을 추가했습니다.
 * - 인라인 스타일을 제거하고, css/modal.css의 전용 클래스들을 활용해 마크업을 단순하게 리팩토링했습니다.
 * 
 * Props:
 * - isOpen: 모달 노출 여부 (boolean)
 * - onClose: 취소/닫기 시 실행할 함수 (function)
 * - onConfirm: 확인 시 실행할 함수 (function)
 * - title: 모달 제목 (string)
 * - subtitle: 모달 부제목/설명 (string, optional)
 * - confirmText: 확인 버튼 텍스트 (string, default: "확인")
 * - cancelText: 취소 버튼 텍스트 (string, default: "취소")
 * - isDanger: 위험 작업 스타일링 여부 (boolean, default: false)
 */
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
