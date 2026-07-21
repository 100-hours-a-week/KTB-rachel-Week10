import React, { createContext, useContext, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch.js'; // [수정 내용 주석] 기존 프로젝트의 useFetch 훅 재사용

// //AuthProvider — 전역 인증 상태 제공 컴포넌트
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const loggedInUserId = sessionStorage.getItem('userId');

  // [수정 내용 주석] 쿠키(JWT)를 기반으로 /users/me 호출하여 로그인 세션 복구
  const { data: userData, loading, error } = useFetch(
    loggedInUserId ? `http://localhost:8080/users/me` : null,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    },
    [loggedInUserId]
  );

  useEffect(() => {
    if (userData && userData.data) {
      setCurrentUser(userData.data);
    }
  }, [userData]);

  useEffect(() => {
    if (error) {
      console.error('사용자 세션 복구 실패:', error.message);
      // 세션 검증이 실패한 경우 스토리지 클리어
      sessionStorage.clear();
      setCurrentUser(null);
    }
  }, [error]);

  // 로그인 처리 함수
  const login = (userId, userData) => {
    sessionStorage.setItem('userId', userId);
    setCurrentUser(userData);
  };

  // 로그아웃 처리 함수
  const logout = () => {
    sessionStorage.clear();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth — 전역 인증 정보 소비용 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
