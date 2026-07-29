import React from 'react';
import * as Icons from '../Icons.js';

export default function ChatInputBar({ inputText, setInputText, onSend, onKeyDown }) {
  return (
    <div className="chat-input-bar">
      <button className="chat-input-bar__attach" title="파일 첨부">
        <Icons.AttachIcon size={18} />
      </button>

      <div className="chat-input-bar__wrap">
        <textarea 
          className="chat-input-bar__textarea"
          placeholder="메시지를 입력하세요..."
          rows="1"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="chat-input-bar__emoji" title="이모지">😊</button>
      </div>

      <button 
        className="chat-input-bar__send" 
        onClick={onSend}
        disabled={!inputText.trim()}
        title="전송"
      >
        <Icons.SendIcon size={16} />
      </button>
    </div>
  );
}
