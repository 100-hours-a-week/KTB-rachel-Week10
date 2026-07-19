import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostList from './pages/PostList.js';
import SignUp from './pages/SignUp.js';
import Login from './pages/Login.js';
import UserInfoUpdate from './pages/UserInfoUpdate.js';
import useFetch from './hooks/useFetch.js'; // 💡 작성하신 useFetch 임포트

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const loggedInUserId = sessionStorage.getItem('userId'); 

  const { data: userData, loading, error } = useFetch(
    loggedInUserId ? `http://localhost:8080/users/${loggedInUserId}` : null,
    {
      method: 'GET',
            credentials: 'include', // 쿠키나 인증 정보를 요청에 포함
            headers: {
            'Content-Type': 'application/json'
            }
    },
    [loggedInUserId]
  ); // 세션에서 가져오는거랑 GET하는거랑 왜 동시에 해? 

  useEffect(() => {
    if (userData) {
      setCurrentUser(userData);
    }
  }, [userData]);

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      console.error('유저 정보를 불러오지 못했습니다:', error.message);
    }
  }, [error]);

  // 로딩 중일 때 UI 분기
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;
  }

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<PostList user={currentUser} />} />
          <Route 
            path="/user/edit" 
            element={
              <UserInfoUpdate 
                userId={loggedInUserId} 
                user={currentUser} 
              />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;