import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { validateNickname } from '../utils/validators.js';
import Header from '../components/Header.js';
import '../css/user-edit.css';

export default function UserInfoUpdate({ userId, user }) {
    const navigate = useNavigate();
    
    // 1. 상태 관리 정의
    const [nickname, setNickname] = useState(user?.nickname || '스타트업코드');
    const [nicknameError, setNicknameError] = useState('');
    const [profileFile, setProfileFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '../../../images/default-profile.png');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // PATCH 전송용 요청 트리거 상태
    const [patchPayload, setPatchPayload] = useState(null);
    // DELETE 전송용 요청 트리거 상태
    const [shouldDelete, setShouldDelete] = useState(false);

    const withdrawalDialogRef = useRef(null);

    // 2. 실시간 닉네임 유효성 검사 (입력 시 작동)
    const handleNicknameChange = (e) => {
        const value = e.target.value;
        setNickname(value);
        
        // 제공해주신 utils/validators.js의 함수 재사용
        const errorMsg = validateNickname(value);
        setNicknameError(errorMsg);
    };

    const isFormValid = nickname.trim() !== "" && !nicknameError;

    // 3. API 통신 - 회원정보 수정 (PATCH)
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

    // 4. API 통신 - 회원 탈퇴 (DELETE)
    const { data: deleteData, error: deleteError } = useFetch(
        shouldDelete ? `http://localhost:8080/users/${userId}` : null,
        {
            method: 'DELETE',
            credentials: "include"
        },
        [shouldDelete]
    );

    // 5. 비즈니스 사이드 이펙트 처리 (성공/실패 토스트 및 알림)
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
            sessionStorage.clear();
            document.body.classList.remove('logged-in'); // 필요한 레이아웃 제거 반영
            navigate('/login');
        }
    }, [deleteData, navigate]);

    useEffect(() => {
        if (deleteError) {
            console.error(deleteError.message);
            alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
            setShouldDelete(false);
        }
    }, [deleteError]);

    // 6. Native Dialog 및 모달 제어 효과
    useEffect(() => {
        if (withdrawalDialogRef.current) {
            if (isModalOpen) {
                withdrawalDialogRef.current.showModal();
            } else {
                withdrawalDialogRef.current.close();
            }
        }
    }, [isModalOpen]);

    // 7. 수정 폼 제출 핸들러
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

    // 8. 이미지 업로드 및 프리뷰 핸들러
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
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
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
                                <input 
                                    type="text" 
                                    className="field__input" 
                                    value={user?.email || 'startupcode@gmail.com'} 
                                    readonly
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
                    <div 
                        id="editCompleteToast" 
                        className={`toast-complete-wrapper ${showToast ? '' : 'hidden'}`} 
                        style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
                    >
                        <button 
                            type="button" 
                            id="btnToastConfirm" 
                            style={{ background: 'var(--blue-900)', color: '#ffffff', padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-full)', border: 'none', fontSize: 'var(--font-size-sm)', fontWeight: 600, boxShadow: 'var(--shadow-lg)', cursor: 'pointer' }}
                            onClick={() => navigate('/posts')}
                        >
                            수정완료
                        </button>
                    </div>
                </main>
            </div>

            {/* 회원 탈퇴 모달 오버레이 및 다이얼로그 구역 */}
            <div 
                id="withdrawalModalOverlay" 
                className={`modal-overlay ${isModalOpen ? '' : 'hidden'}`} 
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 31, 92, 0.4)', display: 'flex', alignItems: 'center', justify: 'center', zIndex: 9999 }}
            >
                <dialog 
                    ref={withdrawalDialogRef}
                    id="withdrawalDialog" 
                    className="modal-content" 
                    style={{ background: 'white', border: 'none', padding: 'var(--space-6)', borderRadius: 'var(--radius-2xl)', maxWidth: '24rem', width: '90%', boxShadow: 'var(--shadow-xl)' }}
                    onClose={() => setIsModalOpen(false)}
                >
                    <h2 id="withdrawalModalTitle" class="modal-title" style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: '6px' }}>
                        회원탈퇴 하시겠습니까?
                    </h2>
                    <p className="modal-subtitle" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                        작성된 게시글과 댓글은 삭제됩니다.
                    </p>
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                            type="button" 
                            id="withdrawalCancelBtn" 
                            className="btn-save" 
                            style={{ padding: '6px 12px', background: 'var(--blue-50)', border: '1px solid var(--color-border)', color: 'var(--color-text-body)', width: 'auto' }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            취소
                        </button>
                        <button 
                            type="button" 
                            id="withdrawalConfirmBtn" 
                            className="btn-withdraw" 
                            style={{ padding: '6px 12px', width: 'auto' }}
                            onClick={() => setShouldDelete(true)}
                        >
                            확인
                        </button>
                    </div>
                </dialog>
            </div>
        </>
    );
}