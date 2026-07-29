import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import PostList from './pages/PostList.js';
import SignUp from './pages/SignUp.js';
import Login from './pages/Login.js';
import UserInfoUpdate from './pages/UserInfoUpdate.js';
import UserPasswordUpdate from './pages/PasswordUpdate.js';
import PostDetail from './pages/PostDetail.js';
import PostWrite from './pages/PostWrite.js';
import ChatDetail from './pages/ChatDetail.js';



function App() {
  return (
    // TODO: 스트릿모드 확인하기
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
            <Route path="/chat-detail/:roomId" element={<ChatDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;