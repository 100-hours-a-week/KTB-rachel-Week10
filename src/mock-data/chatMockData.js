export const INITIAL_MESSAGES = [
  {
      messageId: 1,
      type: 'SYSTEM', // SYSTEM, TALK
      content: '김철수님이 입장하셨습니다.',
      senderId: null,
      senderNickname: null,
      sendTime: '오전 10:00',
      date: '2026-07-29',
      unreadCount: 0,
    },
    {
      messageId: 2,
      type: 'TALK',
      content: '안녕하세요! 다들 오늘 개발 회의 일정 확인하셨나요?',
      senderId: 'user1',
      senderNickname: '김철수',
      sendTime: '오전 10:02',
      date: '2026-07-29',
      unreadCount: 3,
    },
    {
      messageId: 3,
      type: 'TALK',
      content: '네, 저는 리액트 라우터와 테마 CSS 세팅을 마치고 대기 중입니다.',
      senderId: 'user2',
      senderNickname: '이영희',
      sendTime: '오전 10:03',
      date: '2026-07-29',
      unreadCount: 2,
    },
    {
      messageId: 4,
      type: 'TALK',
      content: '👍', // 이모지 전용 테스트용 메시지
      senderId: 'user1',
      senderNickname: '김철수',
      sendTime: '오전 10:05',
      date: '2026-07-29',
      unreadCount: 2,
    },
    // {
    //   messageId: 5,
    //   type: 'TALK',
    //   content: '반갑습니다! 이제 화면 먼저 띄워보고 스타일 정상 작동하는지 같이 확인해봐요.',
    //   senderId: currentUserId, // 내 메시지
    //   senderNickname: currentUserNickname,
    //   sendTime: '오전 11:30',
    //   date: '2026-07-29',
    //   unreadCount: 1,
    // },
    // {
    //   messageId: 6,
    //   type: 'TALK',
    //   content: 'css/chat-detail.css가 정상적으로 물려있는 것 같습니다.',
    //   senderId: currentUserId, // 내 메시지 (동일인/동일시각 연속 메시지 테스트용)
    //   senderNickname: currentUserNickname,
    //   sendTime: '오전 11:30',
    //   date: '2026-07-29',
    //   unreadCount: 1,
    // }
];