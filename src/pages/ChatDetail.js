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
        brokerURL: 'ws://localhost:8080/ws',

        onConnect: (frame) => {
            console.log('소켓 연결 성공');

            client.current.subscribe(`/subscribe/chat.${roomId}`, (message) => {
                console.log('받은 메시지' + message.body);
                const received = JSON.parse(message.body);
                setMessages((prev) => [...prev, received]); // 구독하자자 받을게잇어?
            });
        },

        onStompError: (frame) => {
            console.error('socket 에러 발생: ' + frame.body);
        }
        });

    client.current.activate();

    return () => {
        client.current.deactivate();
    };

    }, [roomId]); 

    const handleSend = () => {
        if (!inputText.trim() || !client.current || !client.current.connected) return;

        const newMsg = {
        messageId: Date.now(),
        type: 'TALK',
        content: inputText,
        senderId: currentUserId,
        senderNickname: currentUserNickname, // PrinciPal 객체로 서버에서는 가져다 쓰는데 프론트에서는 어떻게 쓰지?
        sendTime: formatTime(new Date()),
        date: formatDate(new Date()),
        unreadCount: 3, // TODO: 가상 남은 인원
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        client.current.publish({
            destination: `/publish/chat.${roomId}`,
            body: JSON.stringify({ 
                sender: currentUserId, // 보통 dto에 nickname, id 둘다 받아? 아님 인증객체 Principal에 의해서 .getNickname 할 수 있으니까 id 하나만 가져와? - 실무에서는 보안상 이유로 최소한만가져오고 서버내부에서 직접 꺼내 쓴다
                message: inputText 
            })
        });
    };

    const handleKeyDown = (e) => {
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