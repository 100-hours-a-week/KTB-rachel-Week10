import React from 'react';
import CommentForm from './commentForm.js';
import Comment from './comment.js';

export default function CommentSection({
  comments,
  user,
  userId,
  commentInput,
  setCommentInput,
  handleCreateComment,
  editingCommentId,
  editCommentValue,
  setEditCommentValue,
  onEditClick,
  onDeleteClick,
  onEditSave,
  onEditCancel,
  currentPage,
  setCurrentPage,
  commentsPerPage
}) {
  // 댓글 페이지네이션 연산
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  return (
    <section className="comments">
      <h3 className="comments__title">댓글 ({comments.length})</h3>
      
      {/* 댓글 입력 폼 컴포넌트 */}
      <CommentForm 
        user={user}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
        onSubmit={handleCreateComment}
      />
      
      {/* 댓글 리스트 렌더링 */}
      <ul id="commentListContainer" className="comment-list">
        {currentComments.map(comment => (
          <Comment 
            key={comment.commentId}
            comment={comment}
            userId={userId}
            isEditing={editingCommentId === comment.commentId}
            editValue={editCommentValue}
            setEditValue={setEditCommentValue}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
          />
        ))}
      </ul>

      {/* [수정 내용 주석] 페이지네이션의 인라인 스타일 제거 및 pagination-btn 클래스로 이관 */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
            <button 
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
