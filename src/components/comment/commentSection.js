import React from 'react';
import CommentForm from './commentForm.js';
import Comment from './comment.js';

/**
 * CommentSection — 댓글 전체 영역 감싸는 부모 컴포넌트
 * 
 * [수정 내용 주석]
 * - 기존 PostDetail.js 내의 댓글 목록, 입력 폼, 페이지네이션 렌더링 구문을 하나로 묶어 별도 컴포넌트로 분리하였습니다.
 * - 자식 컴포넌트인 CommentForm과 Comment를 호출하여 렌더링합니다.
 * - 페이지네이션에 존재하던 모든 인라인 스타일을 제거하고, post-detail.css에 추가된 클래스(pagination, pagination-btn)로 대체했습니다.
 * 
 * Props:
 * - comments: 전체 댓글 목록 배열
 * - user: 로그인한 사용자 정보 객체
 * - userId: 로그인한 사용자 ID (string/number)
 * - commentInput: 댓글 입력값 상태 (string)
 * - setCommentInput: 댓글 입력값 변경 함수 (function)
 * - handleCreateComment: 댓글 생성 제출 핸들러 (function)
 * - editingCommentId: 현재 수정 중인 댓글 ID (number)
 * - editCommentValue: 현재 수정 중인 입력 텍스트 (string)
 * - setEditCommentValue: 수정 입력 텍스트 변경 함수 (function)
 * - onEditClick: 수정 모드 진입 핸들러 (function)
 * - onDeleteClick: 삭제 모달 띄우기 핸들러 (function)
 * - onEditSave: 수정 내용 저장 핸들러 (function)
 * - onEditCancel: 수정 취소 핸들러 (function)
 * - currentPage: 현재 댓글 페이지 번호 (number)
 * - setCurrentPage: 댓글 페이지 변경 함수 (function)
 * - commentsPerPage: 페이지당 노출할 댓글 개수 (number)
 */
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
