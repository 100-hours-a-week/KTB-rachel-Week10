import React from 'react';
import * as Icons from '../Icons.js';

export default function ChatNotice({ isNotice, setIsNotice, noticeText }) {
  const content = noticeText || "공지사항이 없습니다.";

  return (
    isNotice ? (
      <div className="chat-notice" onClick={() => setIsNotice(false)}>
        <span className="chat-notice__icon" style={{ color: '#fff' }}>📢</span>
        <span className="chat-notice__label">공지</span>
        <p className="chat-notice__text">
          {content}
        </p>
        <span className="chat-notice__chevron">
          <Icons.ChevronDownIcon size={14} />
        </span>
      </div>
    ) : (
      <div className="chat-notice chat-notice--expanded" onClick={() => setIsNotice(true)}>
        <span className="chat-notice__icon" style={{ color: '#fff' }}>📢</span>
        <span className="chat-notice__label">공지</span>
        <p 
          className="chat-notice__text chat-notice__text--expanded"
          style={{ whiteSpace: 'pre-line' }}
        >
          {content}
        </p>
        <span className="chat-notice__chevron">
          <Icons.ChevronUpIcon size={14} />
        </span>
      </div>
    )
  );
}
