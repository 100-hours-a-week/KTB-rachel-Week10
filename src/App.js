import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js'; // [수정 내용 주석] 전역 인증 프로바이더 임포트
import PostList from './pages/PostList.js';
import SignUp from './pages/SignUp.js';
import Login from './pages/Login.js';
import UserInfoUpdate from './pages/UserInfoUpdate.js';
import UserPasswordUpdate from './pages/PasswordUpdate.js';
import PostDetail from './pages/PostDetail.js';
import PostWrite from './pages/PostWrite.js';


function App() {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/post/write" element={<PostWrite />} />
            <Route path="/post/write/:postId" element={<PostWrite />} />
            <Route path="/user/edit" element={<UserInfoUpdate />} />
            <Route path="/user/password" element={<UserPasswordUpdate />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;