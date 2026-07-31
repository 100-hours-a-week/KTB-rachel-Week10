import React, { forwardRef } from 'react';
import * as Icons from '../Icons.js';

// 메시지 피드 영역 컴포넌트 (forwardRef를 사용해 부모의 feedRef를 연결)
const ChatFeed = forwardRef(({ messages, currentUserId }, ref) => {
  
  // 1. 이모지 전용 메시지 여부 검사
  const checkEmojiOnly = (text) => {
    if (!text) return false; // 📢 text가 undefined이거나 비어있을 때 안전하게 에러 없이 false 리턴
    
    const emojiRegex = /^[\s\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}\u200d\u2700-\u27BF\uE000-\uF8FF\uFE0F]+$/u;
    const isOnlyNumbers = /^\d+$/.test(text.trim());
    return emojiRegex.test(text) && !isOnlyNumbers;
  };

  // 2. 날짜 구분선용 텍스트 변환 (YYYY-MM-DD -> 2026년 7월 29일 수요일)
  const getKoreanDateString = (dateStr) => {
    const d = new Date(dateStr);
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${week[d.getDay()]}`;
  };

  return (
    <div className="chat-feed" ref={ref}>
      {messages.map((msg, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const showDateDivider = !prevMsg || prevMsg.date !== msg.date;

        // 연속 메시지 판별 (동일한 작성자 & 동일한 분 단위 발신 시각)
        const isContMsg = prevMsg && 
                          prevMsg.type === 'TALK' && 
                          msg.type === 'TALK' && 
                          String(prevMsg.senderId) === String(msg.senderId) && 
                          prevMsg.sendTime === msg.sendTime;

        // 연속 메시지 그룹 중 마지막 대화 상자 옆에만 시각을 보여주기 위한 조건
        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
        const isNextCont = nextMsg && 
                           nextMsg.type === 'TALK' && 
                           String(nextMsg.senderId) === String(msg.senderId) && 
                           nextMsg.sendTime === msg.sendTime;
        const showTime = !isNextCont;

        // 시스템 메시지 (입장/퇴장)
        if (msg.type === 'SYSTEM') {
          return (
            <div key={msg.messageId} className="chat-system-msg">
              <span className="chat-system-msg__text">{msg.message}</span>
            </div>
          );
        }

        const isMine = String(msg.senderId) === String(currentUserId);
        const emojiOnly = checkEmojiOnly(msg.message);

        return (
          <React.Fragment key={msg.messageId}>
            {/* 날짜 구분선 */}
            {showDateDivider && (
              <div className="chat-date-divider">
                <span className="chat-date-divider__label">{getKoreanDateString(msg.date)}</span>
              </div>
            )}

            {/* 메시지 행 (나/상대방 및 연속 메시지 클래스 추가) */}
            <div className={`msg-row ${isMine ? 'msg-row--mine' : ''} ${isContMsg ? 'msg-row--cont' : 'msg-row--new-group'}`}>
              
              {/* 상대방 아바타 (연속 메시지일 경우 hidden 처리하여 공간만 확보) */}
              {!isMine && (
                <div className={`msg-avatar ${isContMsg ? 'msg-avatar--hidden' : ''}`}>
                  {msg.senderNickname?.substring(0, 1) || "유"}
                </div>
              )}

              {/* 메시지 내용 몸체 */}
              <div className="msg-body">
                {!isMine && !isContMsg && (
                  <span className="msg-sender">{msg.senderNickname}</span>
                )}
                <div className={`msg-bubble ${isMine ? 'msg-bubble--mine' : 'msg-bubble--other'} ${emojiOnly ? 'msg-bubble--emoji-only' : ''}`}>
                  {msg.message}
                </div>
              </div>

              {/* 읽지 않은 인원 수 및 전송 시간 */}
              <div className="msg-meta">
                {msg.unreadCount > 0 && (
                  <span className="msg-unread-count">{msg.unreadCount}</span>
                )}
                {showTime && <span className="msg-time">{msg.sendTime}</span>}
              </div>

            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
});

ChatFeed.displayName = 'ChatFeed';

export default ChatFeed;
