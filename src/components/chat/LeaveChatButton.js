import React from 'react';
import '../../css/leave-chat-button.css';

export default function LeaveChatButton({ onLeave }) {
    return (
        <section className="drawer-section drawer-section--danger">
            <h3 className="drawer-section__label drawer-section__label--danger">채팅방 나가기</h3>
            <button 
                type="button" 
                className="leave-chat-btn"
                onClick={onLeave}
            >
                채팅방 나가기
            </button>
        </section>
    );
}
