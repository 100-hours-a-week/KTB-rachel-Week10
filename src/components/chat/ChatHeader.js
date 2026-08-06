import React from 'react';
import * as Icons from '../Icons.js';
export default function ChatHeader({ title, subtitle, memberCount, onBack, isOpen, onHamburgerClick }) {
  return (
    <header className="chat-header">
      <button className="chat-header__back" onClick={onBack}>
        <Icons.BackIcon size={20} />
      </button>
      <div className="chat-header__info">
        <h1 className="chat-header__title">
          {title}
          <span className="chat-header__member-count">{memberCount}</span>
        </h1>
        <p className="chat-header__subtitle">{subtitle}</p>
      </div>
      <div className="chat-header__actions">
        <button className="icon-btn" title="검색">
          <Icons.SearchIcon size={18} />
        </button>
        <button 
          className={`chat-header__hamburger ${isOpen ? 'is-open' : ''}`} 
          title="메뉴" 
          onClick={onHamburgerClick}
        >
          <span className="chat-header__hamburger-line"></span>
          <span className="chat-header__hamburger-line"></span>
          <span className="chat-header__hamburger-line"></span>
        </button>
      </div>
    </header>
  );
}
