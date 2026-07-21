import React from 'react';

/**
 * CommentForm — 댓글 입력 폼 컴포넌트
 * 
 * [수정 내용 주석]
 * - 기존 PostDetail.js에 있던 댓글 입력 부분을 별도의 컴포넌트로 분리하였습니다.
 * - 인라인 스타일을 사용하지 않고 기존 CSS 클래스를 활용해 UI를 구성했습니다.
 * 
 * Props:
 * - user: 현재 로그인한 사용자 정보 객체 (nickname 등 포함)
 * - commentInput: 현재 입력 창의 댓글 텍스트 상태 (string)
 * - setCommentInput: 댓글 텍스트 상태 변경 함수 (function)
 * - onSubmit: 폼 제출 시 실행할 함수 (function)
 */
export default function CommentForm({
  user,
  commentInput,
  setCommentInput,
  onSubmit
}) {
  return (
    <form className="comment-input-row" onSubmit={onSubmit}>
      <div className="comment-input-row__avatar">
        {user?.nickname ? user.nickname.charAt(0) : 'Me'}
      </div>
      <div className="comment-input-row__inner">
        <input 
          type="text" 
          id="commentTextArea" 
          className="comment-input" 
          placeholder="댓글을 입력하세요..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button 
          type="submit" 
          id="commentSubmitBtn" 
          className="comment-submit" 
          disabled={!commentInput.trim()}
        >
          등록
        </button>
      </div>
    </form>
  );
}
