import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; 
import { CHAT_INFO_DATA } from '../mock-data/chatInfoData.js';
import { INITIAL_MESSAGES } from '../mock-data/chatMockData.js';
import ChatHeader from '../components/chat/ChatHeader.js';
import ChatNotice from '../components/chat/ChatNotice.js';
import ChatFeed from '../components/chat/ChatFeed.js';
import ChatInputBar from '../components/chat/ChatInputBar.js';
import '../css/chat-detail.css';

export default function ChatDetail() {
    const { currentUser } = useAuth();
    const { roomId } = useParams(); // URL의 :roomId 값을 가져온다.
    const navigate = useNavigate();
    const feedRef = useRef(null);
    const client = useRef(null);

    const currentUserId = currentUser?.userId || 'me';
    const currentUserNickname = currentUser?.nickname || '나';

    const [isNotice, setIsNotice] = useState(true);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');

    // 메시지 갱신 시 스크롤을 항상 아래로 고정
    useEffect(() => {
    if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
    }, [messages]);

    // STOMP Client 객체를 첫렌더링 시에 생성
    useEffect(() => {
    client.current = new Client({ // STOMP 프로토콜을 사용할 수 있게 해주는 'STOMP Client 객체'
        brokerURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'ws://localhost:8080/ws'
            : (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/ws',

        onConnect: (frame) => {
            console.log('소켓 연결 성공');

            client.current.subscribe(`/subscribe/chat.${roomId}`, (message) => {
                const received = JSON.parse(message.body);
                console.log('🔔 소켓 수신 데이터 객체:', received); // ⭕ 객체 구조를 콘솔에서 펼쳐볼 수 있게 수정
                
                // 프론트 피드가 이해할 수 있는 규격(NaN 방지)으로 조립하여 반영
                const formatted = {
                  messageId: Date.now() + Math.random(),
                  type: 'TALK',
                  message: received.message,
                  senderId: received.senderId, // 백엔드 DTO 규격인 senderId 로 매칭
                  senderNickname: received.senderNickname, // 백엔드 DTO 규격인 senderNickname 으로 매칭
                  sendTime: formatTime(new Date()),
                  date: formatDate(new Date()),
                  unreadCount: 0,
                };
                setMessages((prev) => [...prev, formatted]);
            });
        },

        onStompError: (frame) => {
            console.error('socket 에러 발생: ' + frame.body);
        }
        });

    client.current.activate();

    return () => {
        if (client.current) {
            client.current.deactivate();
        }
    };

    }, [roomId]); 

    const handleSend = () => {
        if (!inputText.trim() || !client.current || !client.current.connected) return;

        // ❌ 로컬 렌더링 코드를 뺍니다. (서버에서 반사되어 오는 소켓 메시지로만 1번 그리게 통일)
        setInputText('');

        client.current.publish({
            destination: `/publish/chat.${roomId}`,
            body: JSON.stringify({ 
                sender: currentUserNickname, // DTO 구성에 맞게 보낸이 닉네임 전달
                message: inputText 
            })
        });
    };

    const handleKeyDown = (e) => {
    // 한글 조합 중(글자 아래 밑줄쳐진 상태)일 때는 중복 이벤트 전송을 방지
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
    };

    const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;
    return `${ampm} ${hours}:${minutes}`;
    };
    const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
    };



  return(  
    <div className="chat-detail-page">
      <ChatHeader 
        title={CHAT_INFO_DATA.chatTitle} 
        memberCount={4} 
        onBack={() => navigate('/posts')} 
    />

      <ChatNotice 
        isNotice={isNotice} 
        setIsNotice={setIsNotice} 
        noticeData={CHAT_INFO_DATA}
      />

      <ChatFeed 
        ref={feedRef} 
        messages={messages} 
        currentUserId={currentUserId} 
      />

      <ChatInputBar 
        inputText={inputText} 
        setInputText={setInputText} 
        onSend={handleSend} 
        onKeyDown={handleKeyDown} 
      />
    </div>
  );
}