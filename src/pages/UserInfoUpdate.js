import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { validateNickname } from '../utils/validators.js';
import Header from '../components/Header.js';
import Modal from '../components/Modal.js';
import ToastMessage from '../components/ToastMessage.js';
import { useAuth } from '../context/AuthContext.js'; // [수정 내용 주석] useAuth 임포트 추가
import '../css/user-edit.css';

export default function UserInfoUpdate() {
    const { currentUser, logout } = useAuth(); // [수정 내용 주석] useAuth 훅 사용
    const user = currentUser;
    const userId = currentUser?.userId;

    const navigate = useNavigate();
    
    const [nickname, setNickname] = useState(user?.nickname || '스타트업코드');
    const [nicknameError, setNicknameError] = useState('');
    const [profileFile, setProfileFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '../../../images/default-profile.png');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    
    const [patchPayload, setPatchPayload] = useState(null);
    const [shouldDelete, setShouldDelete] = useState(false);

    const withdrawalDialogRef = useRef(null);

    // 실시간 닉네임 유효성 검사
    const handleNicknameChange = (e) => {
        const value = e.target.value;
        setNickname(value);
        
        const errorMsg = validateNickname(value);
        setNicknameError(errorMsg);
    };

    const isFormValid = nickname.trim() !== "" && !nicknameError;

    // 회원정보 수정
    const { data: fetchedData, error: patchError } = useFetch(
        patchPayload ? `http://localhost:8080/users/${userId}` : null,
        {
            method: 'PATCH',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patchPayload), 
        },
        [patchPayload]
    );

    // 회원 탈퇴
    const { data: deleteData, error: deleteError } = useFetch(
        shouldDelete ? `http://localhost:8080/users/${userId}` : null,
        {
            method: 'DELETE',
            credentials: "include"
        },
        [shouldDelete]
    );

    // 유저 정보 업데이트
    useEffect(() => {
        if (user) {
            setNickname(user.nickname || '');
            setPreviewUrl(user.profileImage || '../../../images/default-profile.png');
        }
    }, [user]);

    // 비즈니스 사이드 이펙트 처리 (성공/실패 토스트 및 알림)
    useEffect(() => {
        if (fetchedData) {
            setShowToast(true); 
            // 토스트 노출 후 조금 뒤에 메인으로 이동
            const timer = setTimeout(() => {
                navigate('/posts');
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [fetchedData, navigate]);

    useEffect(() => {
        if (patchError) {
            console.error(patchError.message);
            alert("회원정보 수정 실패. 다시 시도해 주세요.");
            setPatchPayload(null);
        }
    }, [patchError]);

    useEffect(() => {
        if (deleteData) {
            alert('탈퇴 완료되었습니다.');
            // [수정 내용 주석] 직접 sessionStorage를 지우는 대신, AuthContext의 logout 함수를 실행합니다.
            logout();
            document.body.classList.remove('logged-in'); // 필요한 레이아웃 제거 반영
            navigate('/login');
        }
    }, [deleteData, navigate, logout]);

    useEffect(() => {
        if (deleteError) {
            console.error(deleteError.message);
            alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
            setShouldDelete(false);
        }
    }, [deleteError]);

    // Native Dialog 및 모달 제어 효과 // 이건왜했어?
    useEffect(() => {
        if (withdrawalDialogRef.current) {
            if (isModalOpen) {
                withdrawalDialogRef.current.showModal();
            } else {
                withdrawalDialogRef.current.close();
            }
        }
    }, [isModalOpen]);

    // 수정 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("btnSubmitEdit 이벤트 안에는 들어가네요. 브라우저 콘솔에 찍히나요?");
        
        if (isFormValid) {
            setPatchPayload({
                nickname: nickname.trim(),
                profileImage: profileFile ? profileFile.name : ""
            });
        } else {
            alert("입력 정보를 다시 확인해 주세요.");
        }
    };

    // 이미지 업로드 핸들러
    const handleProfileChange = (e) => {
        const file = e.target.files[0]; 
        if (!file) return;

        console.log("이미지 수정 시도");
        setProfileFile(file);

        // FileReader 대신 더 가볍고 성능이 좋은 리액트 권장 브라우저 탭 주소 참조 방식 채택
        const nextPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(nextPreviewUrl);
        console.log("이미지 변경됨");
    };

    return (
        <>
            {/* 상단 공통 헤더 컴포넌트 주입 */}
            <Header user={user} />

            <div className="user-edit-page">
                <main className="user-edit-main">
                    <h1 className="user-edit-main__title">회원정보수정</h1>
                    
                    <div className="user-edit-card">
                        
                        {/* 프로필 이미지 수정 영역 */}
                        <div className="profile-edit">
                            <div className="profile-edit__img-wrap">
                                <img 
                                    src={previewUrl} 
                                    alt="프로필 사진" 
                                    className="profile-edit__img"
                                />
                                <label htmlFor="profileImageInput" className="profile-edit__overlay-btn">
                                    {/* [수정 내용 주석] SVG의 style 및 presentation 속성을 제거하고 user-edit.css로 이관 */}
                                    <svg viewBox="0 0 14 14">
                                        <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" />
                                    </svg>
                                </label>
                                <input 
                                    type="file" 
                                    id="profileImageInput" 
                                    accept="image/*" 
                                    className="profile-edit__file-input"
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <p className="profile-edit__hint">프로필 사진을 변경하려면 카메라 버튼을 누르세요.</p>
                        </div>

                        {/* 폼 영역 */}
                        <form id="editProfileForm" className="user-edit-form" onSubmit={handleSubmit}>
                            
                            {/* 1. 이메일 필드 (읽기 전용) */}
                            <div className="field">
                                <label className="field__label">
                                    이메일
                                    <span className="field__badge-readonly">Read Only</span>
                                </label>
                                {/* readonly -> readOnly 수정 */}
                                <input 
                                    type="text" 
                                    className="field__input" 
                                    value={user?.email || 'startupcode@gmail.com'} 
                                    readOnly
                                />
                            </div>

                            {/* 2. 닉네임 필드 */}
                            <div className="field">
                                <label htmlFor="nicknameInput" className="field__label">닉네임</label>
                                <input 
                                    type="text" 
                                    id="nicknameInput" 
                                    className="field__input" 
                                    value={nickname}
                                    onChange={handleNicknameChange} 
                                    placeholder="닉네임을 입력해주세요"
                                    required
                                />
                                {/* 에러 메시지가 있을 때만 헬퍼 텍스트 렌더링 */}
                                {nicknameError && (
                                    <p id="nicknameHelperText" className="field__helper field__helper--error">
                                        * {nicknameError}
                                    </p>
                                )}
                            </div>

                            {/* 하단 버튼 영역 */}
                            <div className="user-edit-actions">
                                <button type="submit" id="btnSubmitEdit" className="btn-save">수정하기</button>
                                <button 
                                    type="button" 
                                    id="btnWithdrawal" 
                                    className="btn-withdraw"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    회원 탈퇴
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 수정 완료 토스트 알림 컴포넌트 */}
                    <ToastMessage 
                        id="editCompleteToast"
                        show={showToast} 
                        message="수정완료" 
                        onClick={() => navigate('/posts')} 
                    />
                </main>
            </div>

            {/* 회원 탈퇴 모달 오버레이 및 다이얼로그 구역 */}
            <Modal
                isOpen={isModalOpen}
                title="회원탈퇴 하시겠습니까?"
                subtitle="작성된 게시글과 댓글은 삭제됩니다."
                confirmText="확인"
                cancelText="취소"
                isDanger={true}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => setShouldDelete(true)}
            />
        </>
    );
}