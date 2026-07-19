import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useInput } from '../hooks/useInput.js';
import { validatePassword, validatePasswordCheck } from '../utils/validators.js';
import InputField from '../components/InputField.js';
import Header from '../components/Header.js';

import '../css/user-edit.css';
import '../css/signup.css'; // className = field 스타일 공유를 위해 유지

export default function UserPasswordUpdate({ userId, user }) {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const passwordInput = useInput("", validatePassword);
    const passwordCheckInput = useInput("", (val) => 
        validatePasswordCheck(passwordInput.value, val)
    );

    const isFormValid = 
        passwordInput.value && !passwordInput.error &&
        passwordCheckInput.value && !passwordCheckInput.error;

    const { data: fetchedData, loading, error } = useFetch(
        passwordData ? `http://localhost:8080/users/${userId}/password` : null,
        {
            method: 'PUT',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            // passwordData가 확실히 있을 때만 변환하고, 첫 진입 시점(null)에는 undefined 처리
            body: passwordData ? JSON.stringify(passwordData) : undefined, 
        },
        [passwordData]
    );

    useEffect(() => {
        if (fetchedData) {
            console.log("서버가 준 응답: ", fetchedData);
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
                navigate('/posts');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [fetchedData, navigate]);

    useEffect(() => {
        if (error) {
            console.error("비밀번호 변경 중 에러 발생:", error.message);
            alert("비밀번호 수정 실패. 다시 시도해 주세요.");
            setPasswordData(null); // 다음 전송 시도를 위해 상태 리셋
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormValid) {
            setPasswordData({
                password: passwordInput.value.trim(),
                passwordCheck: passwordCheckInput.value.trim()
            });
        } else {
            alert("입력 정보 및 유효성 검사 결과를 다시 확인해 주세요.");
        }
    };

    return (
        <div className="password-edit-page">
            <Header user={user} />
            <main className="password-edit-main">
                <h1 className="password-edit-main__title">비밀번호 수정</h1>
                
                <div className="password-edit-card">
                    <p className="password-edit-card__desc">
                        안전한 서비스 이용을 위해 비밀번호를 정기적으로 변경해 주세요.
                    </p>
                    
                    <form id="editPasswordForm" className="password-edit-form" onSubmit={handleSubmit}>
                        
                        <InputField
                            label="비밀번호"
                            type="password"
                            id="passwordInput"
                            placeholder="8자 이상 입력하세요"
                            autocomplete="new-password"
                            value={passwordInput.value}
                            onChange={passwordInput.onChange}
                            errorMessage={passwordInput.error}
                            helperText="영문, 숫자 조합 8자 이상 권장"
                        />
                                                
                        <InputField
                            label="비밀번호 확인"
                            type="password"
                            id="passwordCheckInput" 
                            placeholder="비밀번호를 다시 입력하세요"
                            autocomplete="new-password"
                            value={passwordCheckInput.value}
                            onChange={passwordCheckInput.onChange}
                            errorMessage={passwordCheckInput.error}
                            helperText="위에 입력한 비밀번호와 동일하게 입력하세요."
                        />
                       
                        <div className="password-edit-actions">
                            <button 
                                type="submit" 
                                id="btnSubmitPassword" 
                                className="btn-save" 
                                disabled={!isFormValid || loading}
                            >
                                {loading ? "변경 중..." : "수정하기"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 토스트 메시지 영역: showToast 상태에 따라 리액트 조건부 렌더링 또는 hidden 바인딩 */}
                <div 
                    id="passwordToastMessage" 
                    className={`toast-complete-wrapper ${showToast ? '' : 'hidden'}`} 
                    style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
                >
                    <div className="btn-toast-purple" style={{ background: 'var(--blue-900)', color: '#ffffff', padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)', fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>
                        수정완료
                    </div>
                </div>
            </main>
        </div>
    );
}