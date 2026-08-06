import React, { useState } from 'react';

export default function ChatEntryModal({ chatData, setChatData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(chatData?.title || '');
  const [summary, setSummary] = useState(chatData?.summary || '');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    setChatData({
      createChat: true,
      title: title,
      summary: summary
    });
    closeModal();
  };

  const isDone = chatData?.createChat;

  return (
    <>
      {!isDone ? (
        <button type="button" className="btn-add-chat" onClick={openModal}>
          + 💬 채팅방 추가하기
        </button>
      ) : (
        <button type="button" className="btn-add-chat btn-add-chat--done" onClick={openModal}>
          ✓ 채팅방이 추가되었습니다 <span className="btn-add-chat__edit-link">(수정)</span>
        </button>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">채팅방 추가하기</h3>
            
            <div className="form-group">
              <label className="form-label">채팅방 제목</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className={`form-input ${title.length > 15 ? 'form-input--error' : ''}`}
                  placeholder="예: 데일리 영어표현 연습방 (최대 15자)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className={`char-counter ${title.length > 15 ? 'char-counter--error' : ''}`}>
                  ({title.length}/15)
                </span>
              </div>
              {title.length > 15 && <p className="error-message">제목은 15자 이내로 입력해주세요.</p>}
            </div>

            <div className="form-group">
              <label className="form-label">채팅방 상세 설명</label>
              <div className="input-wrapper">
                <textarea 
                  className={`form-input form-textarea ${summary.length > 30 ? 'form-input--error' : ''}`}
                  placeholder="예: 영어표현을 자유롭게 대화해봐요. (최대 30자)"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
                <span className={`char-counter ${summary.length > 30 ? 'char-counter--error' : ''}`}>
                  ({summary.length}/30)
                </span>
              </div>
              {summary.length > 30 && <p className="error-message">상세 설명은 30자 이내로 입력해주세요.</p>}
            </div>

            <div className="modal-actions">
              <button type="button" className="modal-btn-cancel" onClick={closeModal}>취소</button>
              <button type="button" className="modal-btn-submit" onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}