import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; 
import { CHAT_INFO_DATA } from '../mock-data/chatInfoData.js';
import ChatHeader from '../components/chat/ChatHeader.js';
import ChatNotice from '../components/chat/ChatNotice.js';
import ChatFeed from '../components/chat/ChatFeed.js';
import ChatInputBar from '../components/chat/ChatInputBar.js';
import ChatSettingsMenu from '../components/chat/ChatSettingsMenu.js';
import Modal from '../components/Modal.js';
import '../css/chat-detail.css';

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

const formatHistoryData = (historyChats) => {
    return historyChats.map(chat => ({
        messageId: chat.messageId || Date.now() + Math.random(),
        type: chat.chatRole,
        message: chat.message,
        senderId: chat.senderId,
        senderNickname: chat.senderNickname,
        chatRoomId: chat.chatRoomId,
        chatRole: chat.chatRole,
        messageRole: chat.messageRole,
        sendTime: formatTime(new Date(chat.createdAt || Date.now())),
        date: formatDate(new Date(chat.createdAt || Date.now())),
        unreadCount: 0,
    })).reverse();
};

const formatSocketMessage = (received) => {
    return {
        messageId: Date.now() + Math.random(),
        type: received.chatRole, 
        message: received.message,
        senderId: received.senderId,
        senderNickname: received.senderNickname, 
        chatRoomId: received.chatRoomId,
        chatRole: received.chatRole,
        messageRole: received.messageRole,
        sendTime: formatTime(new Date()),
        date: formatDate(new Date()),
        unreadCount: 0,
    };
};

export default function ChatDetail() {
    const { currentUser } = useAuth();
    const { roomId } = useParams(); // URL의 :roomId 값을 가져온다.
    const navigate = useNavigate();
    const feedRef = useRef(null);
    const client = useRef(null);

    const currentUserId = currentUser?.userId || 'me';
    const currentUserNickname = currentUser?.nickname || '나';

    const [isNotice, setIsNotice] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [chatTitle, setChatTitle] = useState(CHAT_INFO_DATA.chatTitle);
    const [chatSubtitle, setChatSubtitle] = useState(CHAT_INFO_DATA.chatSummary);
    const [chatNoticeText, setChatNoticeText] = useState(CHAT_INFO_DATA.noticeContent);
    const [participantCount, setParticipantCount] = useState(1);
    
    const [hostId, setHostId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const handleSaveSettings = async () => {
        try {
            const response = await fetch(`/chatrooms/${roomId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: chatTitle,
                    summary: chatSubtitle,
                    notice: chatNoticeText
                })
            });

            if (response.ok) {
                alert("채팅방 설정이 성공적으로 변경되었습니다.");
                setIsDrawerOpen(false);
            } else {
                alert("설정 변경에 실패했습니다. 권한을 확인해주세요.");
            }
        } catch (error) {
            console.error("채팅방 설정 변경 에러:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    const confirmDeleteRoom = async () => {
        if (!isOwner) {
            alert("방장만 채팅방을 삭제할 수 있습니다.");
            setIsDeleteModalOpen(false);
            return;
        }

        try {
            const response = await fetch(`/chatrooms/${roomId}`, { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                setIsDeleteModalOpen(false);
                alert("채팅방이 삭제되었습니다.");
                navigate('/posts'); 
            } else {
                alert("삭제 실패했습니다. 권한을 확인해주세요.");
            }
        } catch (error) {
            console.error("채팅방 삭제 에러:", error);
        }
    };

    const confirmLeaveRoom = async () => {
        try {
            const response = await fetch(`/chatrooms/${roomId}/leave`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setIsLeaveModalOpen(false);
                alert("채팅방을 나갔습니다.");
                navigate('/posts');
            } else {
                alert("나가기 실패했습니다.");
            }
        } catch (error) {
            console.error("채팅방 나가기 에러:", error);
        }
    };

    // 메시지 갱신 시 스크롤을 항상 아래로 고정
    useEffect(() => {
    if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
    }, [messages]);

    // 채팅방 정보 조회후 STOMP 웹소켓 연결 시작
    useEffect(() => {
        
        const fetchChatRoomInfo = async () => {
            try {
                const response = await fetch(`/chatrooms/${roomId}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    const roomInfo = (await response.json()).data; 
                    if (roomInfo) {
                        setChatTitle(roomInfo.title);
                        setChatSubtitle(roomInfo.summary);
                        setChatNoticeText(roomInfo.notice || '등록된 공지사항이 없습니다.');
                        setParticipantCount(roomInfo.participantCount || 1);
                        
                        const fetchedHostId = String(roomInfo.hostId);
                        setHostId(fetchedHostId);
                        setIsOwner(fetchedHostId === String(currentUserId));

                        setMessages(roomInfo.historyChats?.length > 0 ? formatHistoryData(roomInfo.historyChats) : []);
                    }
                }
                connectStomp();
            } catch (error) {
                console.error("채팅방 정보 조회 실패:", error);
            }
        };

        const connectStomp = () => {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                            ? 'localhost:8080' : window.location.host;

            client.current = new Client({ 
                brokerURL: `${wsProtocol}//${wsHost}/ws`,
                onConnect: () => {
                    console.log('소켓 연결 성공');
                    client.current.subscribe(`/subscribe/chat.${roomId}`, (message) => {
                        const received = JSON.parse(message.body);
                        console.log("서버에서 전달받은 DTO:", received);
                        setMessages((prev) => [...prev, formatSocketMessage(received)]);
                    });

                    // 구독 완료 직후, 방에 처음 들어왔다는 입장 메시지를 백엔드에 전송
                    client.current.publish({
                        destination: `/publish/chat.enter.${roomId}`,
                        body: JSON.stringify({ 
                            messageId: crypto.randomUUID(),
                            message: "ENTER", // 백엔드 Validation 통과용 임의 문자열
                            senderId: currentUserId
                        })
                    });
                },
                onStompError: (frame) => console.error('socket 에러 발생: ' + frame.body)
            });
            client.current.activate();
        };

        //cleanup
        fetchChatRoomInfo();
        return () => {
            if (client.current) {
                client.current.deactivate();
                client.current = null;
            }
        };
    }, [roomId]);

    useEffect(() => {
        if (!isDrawerOpen) return;

        const fetchParticipants = async () => {
            try {
                const response = await fetch(`/chatrooms/${roomId}/participant`, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = (await response.json()).data;
                    console.log("명단 API 응답 데이터:", data);
                    
                    if (data && data.participants) {
                        console.log("참여자 목록:", data.participants);
                        const pList = data.participants.sort((a, b) => {
                            if (a.messageRole === 'HOST' && b.messageRole !== 'HOST') return -1;
                            if (a.messageRole !== 'HOST' && b.messageRole === 'HOST') return 1;
                            return 0;
                        });
                        setParticipants(pList);
                    } else {
                        console.log("data.participants가 존재하지 않음");
                    }
                } else {
                    console.error("API 호출 실패:", response.status);
                }
            } catch (error) {
                console.error("참여자 명단 조회 에러:", error);
            }
        };

        fetchParticipants();
    }, [isDrawerOpen, roomId]);

    const handleSend = () => {
        if (!inputText.trim() || !client.current || !client.current.connected) return;

        setInputText('');

        const payload = { 
            senderId: currentUserId,
            messageId: crypto.randomUUID(),
            message: inputText 
        };
        console.log("서버로 보내는 DTO:", payload);

        client.current.publish({
            destination: `/publish/chat.${roomId}`,
            body: JSON.stringify(payload)
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


  return(  
    <div className="chat-detail-page">
      <ChatHeader 
        title={chatTitle} 
        subtitle={chatSubtitle}
        memberCount={participantCount} 
        onBack={() => navigate('/posts')} 
        isOpen={isDrawerOpen}
        onHamburgerClick={() => setIsDrawerOpen(!isDrawerOpen)}
    />

      <ChatNotice 
        isNotice={isNotice} 
        setIsNotice={setIsNotice} 
        noticeText={chatNoticeText}
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

      <ChatSettingsMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={chatTitle}
        setTitle={setChatTitle}
        subtitle={chatSubtitle}
        setSubtitle={setChatSubtitle}
        notice={chatNoticeText}
        setNotice={setChatNoticeText}
        onSave={handleSaveSettings}
        isOwner={isOwner}
        onDelete={() => setIsDeleteModalOpen(true)}
        onLeave={() => setIsLeaveModalOpen(true)}
        participants={participants}
        currentUserId={currentUserId}
      />

      <Modal 
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
         onConfirm={confirmDeleteRoom}
         title="채팅방 삭제"
         subtitle="정말로 이 채팅방을 삭제하시겠습니까? (이 작업은 복구할 수 없습니다)"
         confirmText="삭제하기"
         cancelText="취소"
         isDanger={true}
       />

      <Modal 
         isOpen={isLeaveModalOpen}
         onClose={() => setIsLeaveModalOpen(false)}
         onConfirm={confirmLeaveRoom}
         title="채팅방 나가기"
         subtitle="채팅방에서 나가시겠습니까? 나간 후에는 다시 초대받아야 참여할 수 있습니다."
         confirmText="나가기"
         cancelText="취소"
         isDanger={true}
       />
    </div>
  );
}