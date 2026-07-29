import React from 'react';
import * as Icons from '../Icons.js';
import { CHAT_INFO_DATA } from '../../mock-data/chatInfoData.js';

export default function ChatHeader({ memberCount, onBack }) {
  return (
    <header className="chat-header">
      <button className="chat-header__back" onClick={onBack}>
        <Icons.BackIcon size={20} />
      </button>
      <div className="chat-header__info">
        <h1 className="chat-header__title">
          {CHAT_INFO_DATA.chatTitle}
          <span className="chat-header__member-count">{memberCount}</span>
        </h1>
        <p className="chat-header__subtitle">{CHAT_INFO_DATA.chatSummary}</p>
      </div>
      <div className="chat-header__actions">
        <button className="icon-btn" title="검색">
          <Icons.SearchIcon size={18} />
        </button>
        <button className="icon-btn" title="메뉴">
          <Icons.HamburgurBar size={18} />
        </button>
      </div>
    </header>
  );
}
