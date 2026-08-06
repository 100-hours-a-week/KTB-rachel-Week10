import React from 'react';

export default function ChatSettingsMenu({
  isOpen,
  onClose,
  title,
  setTitle,
  subtitle,
  setSubtitle,
  notice,
  setNotice,
  onSave,
  isOwner,
  onDelete,
  participants,
  currentUserId
}) {
  return (
    <>
      <div 
        className={`drawer-overlay ${!isOpen ? 'drawer-overlay--hidden' : ''}`} 
        onClick={onClose}
      />
      <aside className={`chat-drawer ${!isOpen ? 'chat-drawer--hidden' : ''}`}>
        <header className="drawer-header">
          <h2 className="drawer-header__title">채팅방 설정</h2>
          <button className="drawer-header__close" onClick={onClose} title="닫기">
            ✕
          </button>
        </header>

        <div className="drawer-body">
          <section className="drawer-section">
            <h3 className="drawer-section__label">정보 수정</h3>
            <div className="drawer-edit-form">
              <div className="drawer-field">
                <label className="drawer-field__label">채팅방 제목</label>
                <input 
                  type="text" 
                  className="drawer-field__input" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="제목을 입력하세요"
                />
              </div>
              <div className="drawer-field">
                <label className="drawer-field__label">소제목</label>
                <input 
                  type="text" 
                  className="drawer-field__input" 
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)} 
                  placeholder="소제목을 입력하세요"
                />
              </div>
              <div className="drawer-field">
                <label className="drawer-field__label">공지사항</label>
                <textarea 
                  className="drawer-field__textarea" 
                  value={notice} 
                  onChange={(e) => setNotice(e.target.value)} 
                  placeholder="공지사항을 입력하세요"
                />
              </div>
              <button 
                type="button" 
                className="drawer-btn-save" 
                onClick={onSave}
              >
                저장하기
              </button>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section__label">참여 인원</h3>
            <ul className="drawer-member-list">
              {participants?.map((p) => {
                const isHost = p.messageRole === 'HOST';
                const isMe = String(p.userId) === String(currentUserId);
                return (
                  <li key={p.userId} className="drawer-member-item">
                    <div className={`drawer-member-item__avatar ${isHost ? 'drawer-member-item__avatar--host' : ''}`}>
                      👤
                      {isHost && <span className="drawer-member-item__crown">👑</span>}
                    </div>
                    <div className="drawer-member-item__info">
                      <div className="drawer-member-item__name">
                        {p.nickname}
                        {isHost && <span className="drawer-member-item__host-badge">방장</span>}
                        {isMe && <span className="drawer-member-item__me-badge">나</span>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {isOwner && (
            <section className="drawer-section drawer-section--danger">
              <h3 className="drawer-section__label drawer-section__label--danger">방장 권한</h3>
              <button 
                type="button" 
                className="drawer-btn-danger"
                onClick={onDelete}
              >
                채팅방 삭제하기
              </button>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
