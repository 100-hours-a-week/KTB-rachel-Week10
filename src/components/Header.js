import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 리액트 라우터 훅
import '../css/header.css';
import defaultProfile from '../images/default-profile.png'; // 기본 프로필 이미지 임포트

export default function Header({ user, setIsLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const location = useLocation();

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

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 회원정보 수정 이동
  const handleEditInfo = () => {
    navigate('/user/edit', { state: { userId: user?.userId } });
    setIsDropdownOpen(false);
  };

  // 비밀번호 수정 이동
  const handleEditPwd = () => {
    navigate('/user/password', { state: { userId: user?.userId } });
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

  const isMainPage = location.pathname === '/posts' || location.pathname === '/post';

  return (
    <nav className="global-header" data-auth="user">
      <div className="header-container">
        
        <button
          type="button"
          id="headerBackBtn"
          onClick={handleBack}
          className="btn-back"
          style={{ visibility: isMainPage ? 'hidden' : 'visible' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* 가운데: 헤더 타이틀 */}
        <h1 
          className="header-title" 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/posts')}
        >
          블루커뮤니티
        </h1>

        {/* 오른쪽: 사용자 정보 및 드롭다운 메뉴 구역 */}
        <div className="header-profile-wrapper" ref={dropdownRef}>
          <button 
            type="button"
            id="headerProfileBtn"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="btn-profile"
          >
            <img 
              src={user?.profileImage || defaultProfile} 
              alt="프로필" 
              className="profile-img" 
            />
          </button>

          {/* 드롭다운 메뉴 */}
          <ul 
            id="headerDropdownMenu" 
            className={`header-dropdown ${isDropdownOpen ? '' : 'hidden'}`}
          >
            <li>
              <button
                type="button"
                id="menuEditInfo"
                onClick={handleEditInfo}
              >
                회원정보수정
              </button>
            </li>
            <li>
              <button
                type="button"
                id="menuEditPwd"
                onClick={handleEditPwd}
              >
                비밀번호수정
              </button>
            </li>
            <li>
              <button
                type="button"
                id="menuLogout"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}