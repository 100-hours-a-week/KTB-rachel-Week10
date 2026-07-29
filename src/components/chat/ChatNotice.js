import React from 'react';
import * as Icons from '../Icons.js';

export default function ChatNotice({ isNotice, setIsNotice, noticeData }) {
  // 부모로부터 noticeData를 안전하게 받지 못한 경우에 대한 기본값 방어
  const title = noticeData?.noticeTitle || "공지";
  const summary = noticeData?.noticeSummary || "";
  const detail = noticeData?.noticeDetail || "";

  return (
    isNotice ? (
      <div className="chat-notice" onClick={() => setIsNotice(false)}>
        <span className="chat-notice__icon" style={{ color: '#fff' }}>📢</span>
        <span className="chat-notice__label">{title}</span>
        <p className="chat-notice__text">
          {summary}
        </p>
        <span className="chat-notice__chevron">
          <Icons.ChevronDownIcon size={14} />
        </span>
      </div>
    ) : (
      <div className="chat-notice chat-notice--expanded" onClick={() => setIsNotice(true)}>
        <span className="chat-notice__icon" style={{ color: '#fff' }}>📢</span>
        <span className="chat-notice__label">{title}</span>
        <p 
          className="chat-notice__text chat-notice__text--expanded"
          style={{ whiteSpace: 'pre-line' }}
        >
          {detail}
        </p>
        <span className="chat-notice__chevron">
          <Icons.ChevronUpIcon size={14} />
        </span>
      </div>
    )
  );
}
