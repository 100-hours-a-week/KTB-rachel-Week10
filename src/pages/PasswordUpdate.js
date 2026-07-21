import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useInput } from '../hooks/useInput.js';
import { validatePassword, validatePasswordCheck } from '../utils/validators.js';
import InputField from '../components/InputField.js';
import Header from '../components/Header.js';
import ToastMessage from '../components/ToastMessage.js'; // [수정 내용 주석] 공통 토스트 컴포넌트 임포트
import { useAuth } from '../context/AuthContext.js'; // [수정 내용 주석] useAuth 임포트 추가

import '../css/user-edit.css';
import '../css/signup.css'; // className = field 스타일 공유를 위해 유지

export default function UserPasswordUpdate() {
    const { currentUser } = useAuth(); // [수정 내용 주석] useAuth 훅 사용
    const user = currentUser;
    const userId = currentUser?.userId;

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
        <div className="user-edit-page">
            <Header user={user} />
            <main className="user-edit-main">
                <h1 className="user-edit-main__title">비밀번호 수정</h1>
                
                <div className="user-edit-card">
                    {/* [수정 내용 주석] 인라인 스타일을 user-edit-card__desc 클래스로 교체 */}
                    <p className="user-edit-card__desc">
                        안전한 서비스 이용을 위해 비밀번호를 정기적으로 변경해 주세요.
                    </p>
                    
                    <form id="editPasswordForm" className="user-edit-form" onSubmit={handleSubmit}>
                        
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
                       
                        <div className="user-edit-actions">
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

                {/* [수정 내용 주석] 공통 토스트 알림 컴포넌트 적용 */}
                <ToastMessage 
                    id="passwordToastMessage"
                    show={showToast} 
                    message="수정완료" 
                />
            </main>
        </div>
    );
}