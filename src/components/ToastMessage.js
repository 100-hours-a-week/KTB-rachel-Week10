import React from 'react';
import '../css/toastMessage.css'; 

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
