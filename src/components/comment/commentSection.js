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
