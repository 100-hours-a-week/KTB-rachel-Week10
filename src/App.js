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

/**
 * App — 메인 라우터 컴포넌트
 * 
 * [수정 내용 주석]
 * - App.js가 가지던 전역 상태(currentUser) 및 useFetch 호출 코드를 지우고 AuthProvider 내부로 이관하였습니다.
 * - App.js는 이제 오직 라우팅 설정 역할만 담당하며, 자식 컴포넌트에 props(userId, user)를 전달하지 않습니다.
 */
function App() {
  return (
    <AuthProvider> {/* [수정 내용 주석] 앱 전체를 AuthProvider로 감싸 전역 상태 제공 */}
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