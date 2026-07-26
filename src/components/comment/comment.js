import React from 'react';

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
