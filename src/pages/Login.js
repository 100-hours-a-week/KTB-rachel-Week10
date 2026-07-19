import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useInput } from '../hooks/useInput.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import InputField from '../components/InputField.js';
import '../css/login.css'

export default function Login() {

    // 이메일 유효성 검사
    // 비밀번호 유효성 검사
    // POST + 페이지이동
    // 로그인 페이지 이동

    const navigate = useNavigate();
    const [logindata, setLoginData] = useState(null);
   
    const emailInput = useInput("", validateEmail);
    const passwordInput = useInput("", validatePassword);
    const isFormValid = 
        emailInput.value && !emailInput.error &&
        passwordInput.value && !passwordInput.error;

    // POST fetch
    const { data: fetchedData, loading, error } = useFetch(
        logindata ? 'http://localhost:8080/users/login' : null,
        {
          method: 'POST',
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logindata), 
        },
        [logindata]
    );

     //에러 또는 성공처리
    useEffect(() => {
        if (fetchedData) {
            console.log("로그인 성공. 게시판 목록 조회 페이지로 이동합니다.");
            navigate('/posts'); 
        }
    }, [fetchedData, navigate]);

    useEffect(() => {
        if (error) {
            console.log(error.message);
            alert("로그인 실패. 다시 시도해 주세요.");
            setLoginData(null); // 에러가 났으니 다음 클릭을 위해 상태 리셋
        }
    }, [error]);


    
    // 버튼 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        // 간단한 유효성 검사
        if (isFormValid) {
            // TODO: new Format
            setLoginData({
                email: emailInput.value,
                password: passwordInput.value                
            });
        } else {
            alert("입력 정보를 다시 확인해 주세요.");
        }
    };
    
    // 회원가입페이지로 이동
    const handleGoToSignUp = useCallback(() => {
            navigate(`/signup`); 
    }, [navigate]);
    
    return (
        <div className="login-page">
        {/* 디자인을 위해 추가된 카드 래퍼 */}
        <div className="login-card">
            
            {/* 왼쪽 영역 커뮤니티 설명 */}
            <div className="login-panel">
                <div>
                    {/* 로고 영역 */}
                    <div className="login-panel__logo">
                        <div className="login-panel__logo-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2.5 4.5A2 2 0 014.5 2.5h11a2 2 0 012 2v9a2 2 0 01-2 2H12l-2 2.5L8 15.5H4.5a2 2 0 01-2-2v-9z" fill="rgba(255,255,255,0.9)" />
                            </svg>
                        </div>
                        <span className="login-panel__logo-name">블루커뮤니티</span>
                    </div>

                    {/* 메인 타이틀 */}
                    <h2 className="login-panel__heading">
                        개발자들이<br />모이는 곳
                    </h2>
                    <p className="login-panel__desc">
                        경험을 나누고, 함께 성장하는<br />개발자 커뮤니티에 참여하세요.
                    </p>
                </div>

                {/* 기능 목록 */}
                <ul className="login-panel__features">
                    <li className="login-panel__feature">
                        <div className="login-panel__feature-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2L3 6v4c0 4 3.5 7.5 7 8 3.5-.5 7-4 7-8V6l-7-4z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.8)" stroke-width="1.4" stroke-linejoin="round" />
                                <path d="M7 10l2 2 4-4" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="login-panel__feature-title">신뢰할 수 있는 커뮤니티</h4>
                            <p className="login-panel__feature-desc">검증된 개발자들이 모인 안전한 공간</p>
                        </div>
                    </li>

                    
                    <li className="login-panel__feature">
                        <div className="login-panel__feature-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="rgba(255,255,255,0.8)" stroke-width="1.4" />
                                <path d="M6.5 10a3.5 3.5 0 007 0" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" />
                                <circle cx="7.5" cy="8" r="1" fill="rgba(255,255,255,0.9)" />
                                <circle cx="12.5" cy="8" r="1" fill="rgba(255,255,255,0.9)" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="login-panel__feature-title">활발한 지식 공유</h4>
                            <p className="login-panel__feature-desc">현직 개발자들의 생생한 경험과 인사이트</p>
                        </div>
                    </li>

                    
                    <li className="login-panel__feature">
                        <div className="login-panel__feature-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12M10 4l6 6-6 6" stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="login-panel__feature-title">커리어 성장</h4>
                            <p className="login-panel__feature-desc">취업, 이직, 사이드 프로젝트까지 함께</p>
                        </div>
                    </li>
                </ul>

                {/* 푸터 카피라이트 */}
                <div className="login-panel__footer">
                    <p className="login-panel__desc-xs">© 2026 블루커뮤니티 · 개발자를 위한 공간</p>
                </div>
            </div>

            {/* 오른쪽 영역 (기존 폼) */}
            <div className="login-form-area">
                <h2 className="login-form-area__title">로그인</h2>
                <p className="login-form-area__subtitle">계정 정보를 입력하세요.</p>
                
                <form id="loginForm" className="login-form">
                    <InputField
                        label="이메일"
                        type="email"
                        id="emailInput"
                        placeholder="example@email.com"
                        autocomplete="off"
                        value={emailInput.value}
                        onChange={emailInput.onChange}
                        errorMessage={emailInput.error}
                        helperText="로그인에 사용할 이메일 주소"
                    />
                        
                  <InputField
                        label="비밀번호"
                        type="password"
                        id="passwordInput"
                        placeholder="8자 이상 입력하세요"
                        autocomplete="new-password"
                        value={passwordInput.value}
                        onChange={passwordInput.onChange}                            errorMessage={passwordInput.error}
                        helperText="영문, 숫자 조합 8자 이상 권장"
                    />
                    <button type="submit" id="loginSubmitBtn" className="btn-primary" disabled={!isFormValid || loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </button>

                </form>   
                <div className="login-switch">
                    아직 계정이 없으신가요? 
                    <button type="button" id="goToSignupBtn" className="login-switch__link" onClick={handleGoToSignUp}>
                        회원가입
                    </button>
                </div>    
            </div>
        </div>
    </div>

    );

}