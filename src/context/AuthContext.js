import React, { createContext, useContext, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch.js'; 

// //AuthProvider — 전역 인증 상태 제공 컴포넌트
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const loggedInUserId = sessionStorage.getItem('userId');

  const { data: userData, loading, error } = useFetch(
    loggedInUserId ? `/users/me` : null,
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
      // 세션 검증이 실패한 경우
      sessionStorage.clear();
      setCurrentUser(null);
    }
  }, [error]);

  const login = (userId, userData) => {
    sessionStorage.setItem('userId', userId);
    setCurrentUser(userData);
  };

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


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
