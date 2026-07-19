import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 우리가 아는 진짜 리액트 라우터 훅
import '../css/header.css';

export default function Header({ user, setIsLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  // 외부 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // 게시글 전체 조회 이동
  const handleGoHome = () => {
    navigate('/posts');
  };

  // 회원정보 수정 이동
  const handleEditInfo = (e) => {
    e.preventDefault();
    navigate('/user/edit', { state: { userId: user?.id } });
    setIsDropdownOpen(false);
  };

  // 비밀번호 수정 이동
  const handleEditPwd = (e) => {
    e.preventDefault();
    navigate('/user/password', { state: { userId: user?.id } });
    setIsDropdownOpen(false);
  };

  // 로그아웃
  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    sessionStorage.clear();
    
    // 상위 컴포넌트의 상태를 변경
    if (setIsLoggedIn) {
      setIsLoggedIn(false); 
    }

    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 왼쪽: 로고 및 홈 이동 버튼 */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v7a1.5 1.5 0 01-1.5 1.5H9l-1 2-1-2H3.5A1.5 1.5 0 012 10.5v-7z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="text-base font-bold text-blue-900 tracking-tight group-hover:text-blue-700 transition-colors">
            블루커뮤니티
          </span>
        </button>

        {/* 오른쪽: 사용자 정보 및 드롭다운 메뉴 구역 */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          <span className="text-sm text-slate-500 font-medium hidden sm:block">
            {user?.name || '사용자'}
          </span>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            >
              {user?.avatar || 'U'}
            </button>

            {/* 드롭다운 메뉴 */}
            <div className={`absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-blue-100 py-1 transition-all duration-150 z-50 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <button
                onClick={handleEditInfo}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                정보 수정
              </button>
              <button
                onClick={handleEditPwd}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                비밀번호 변경
              </button>
              <hr className="border-blue-50 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}