import React from 'react';

/**
 * Comment — 개별 댓글 컴포넌트
 * 
 * [수정 내용 주석]
 * - 모든 인라인 스타일(style={{...}}) 속성을 제거하고 CSS 클래스명(className)으로 교체하였습니다.
 * - 댓글 수정/삭제 버튼 컨테이너, 개별 버튼들, 수정 모드 시의 입력 컨테이너 및 취소 버튼에 클래스를 매핑하였습니다.
 * 
 * Props:
 * - comment: 댓글 데이터 객체 (commentId, author, content, createdAt, userId)
 * - userId: 현재 로그인한 사용자의 ID (string/number)
 * - isEditing: 현재 이 댓글이 수정 중인지 여부 (boolean)
 * - editValue: 수정 중인 입력값 (string)
 * - setEditValue: 수정 입력값 상태 변경 함수 (function)
 * - onEditClick: 수정 버튼 클릭 시 실행할 함수 (function)
 * - onDeleteClick: 삭제 버튼 클릭 시 실행할 함수 (function)
 * - onEditSave: 수정 완료(저장) 버튼 클릭 시 실행할 함수 (function)
 * - onEditCancel: 수정 취소 버튼 클릭 시 실행할 함수 (function)
 */
export default function Comment({
  comment,
  userId,
  isEditing,
  editValue,
  setEditValue,
  onEditClick,
  onDeleteClick,
  onEditSave,
  onEditCancel
}) {
  const avatarInitial = comment.author ? comment.author.charAt(0) : 'U';
  
  // 날짜 형식 포맷팅
  const formattedDate = comment.createdAt 
    ? comment.createdAt.replace('T', ' ').substring(0, 19) 
    : '';

  return (
    <li className="comment-item">
      {/* 아바타 영역 */}
      <div className="comment-item__avatar">{avatarInitial}</div>

      <div className="comment-item__body">
        <div className="comment-item__meta">
          <span className="comment-item__name">{comment.author}</span>
          <span className="comment-item__time">{formattedDate}</span>
          
          {/* [수정 내용 주석] 인라인 스타일을 comment-item__actions, comment-item__btn-edit, comment-item__btn-delete 클래스로 교체 */}
          {String(comment.userId) === String(userId) && !isEditing && (
            <div className="comment-item__actions">
              <button 
                type="button" 
                className="comment-item__btn-edit"
                onClick={() => onEditClick(comment)}
              >
                수정
              </button>
              <button 
                type="button" 
                className="comment-item__btn-delete"
                onClick={() => onDeleteClick(comment)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          // [수정 내용 주석] 인라인 스타일을 comment-item__edit-row, comment-submit--cancel 클래스로 교체
          <div className="comment-item__edit-row">
            <input 
              type="text" 
              className="comment-input" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)} 
            />
            <button 
              type="button" 
              className="comment-submit"
              disabled={!editValue.trim()} // 빈 값 입력 방지
              onClick={() => onEditSave(comment.commentId)}
            >
              저장
            </button>
            <button 
              type="button" 
              className="comment-submit comment-submit--cancel" 
              onClick={onEditCancel}
            >
              취소
            </button>
          </div>
        ) : (
          // 일반 텍스트 모드 렌더링
          <p className="comment-item__text">{comment.content}</p>
        )}
      </div>
    </li>
  );
}
