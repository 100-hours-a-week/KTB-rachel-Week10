import React from 'react';
import '../css/toastMessage.css'; // [수정 내용 주석] 공통 토스트 스타일 파일 임포트

/**
 * ToastMessage — 공통 토스트 알림 컴포넌트
 * 
 * [수정 내용 주석]
 * - 기존 UserInfoUpdate와 PasswordUpdate의 중복되는 토스트 UI 마크업을 공통 컴포넌트로 분리하였습니다.
 * - onClick 프롭 존재 여부에 따라 이동 버튼형(UserInfoUpdate) 혹은 단순 안내형(PasswordUpdate)으로 렌더링되도록 유연성을 높였습니다.
 * - 인라인 스타일을 모두 제거하고, css/toastMessage.css의 전용 클래스를 바인딩하여 마크업을 단순화시켰습니다.
 * 
 * Props:
 * - show: 토스트 노출 여부 (boolean)
 * - message: 표시할 텍스트 (string)
 * - onClick: 클릭 시 실행할 핸들러 (function, optional)
 * - id: DOM 아이디 (string, optional)
 */
export default function ToastMessage({ show, message, onClick, id }) {
  return (
    <div 
      id={id}
      className={`toast-complete-wrapper ${show ? '' : 'hidden'}`} 
    >
      {onClick ? (
        // 클릭 핸들러(onClick)가 존재하면 확인 버튼 형태로 표시
        <button 
          type="button" 
          id="btnToastConfirm" 
          onClick={onClick}
        >
          {message}
        </button>
      ) : (
        // 클릭 핸들러가 없으면 단순 안내용 div로 표시
        <div className="btn-toast-purple">
          {message}
        </div>
      )}
    </div>
  );
}
