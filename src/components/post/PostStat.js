import React from 'react';

/**
 * PostStat — 게시글 통계(좋아요, 조회수, 댓글수) 컴포넌트
 * 
 * [수정 내용 주석]
 * - 확장자를 .jsx에서 .js로 변경하여 프로젝트 일관성을 유지시켰습니다.
 * - PostDetail.js 내의 게시글 통계 부분을 별도 컴포넌트로 분리하였습니다.
 * - 인라인 스타일과 SVG 프레젠테이션 속성을 사용하지 않고 CSS 클래스명을 활용합니다.
 * 
 * Props:
 * - isLiked: 현재 사용자가 좋아요를 눌렀는지 여부 (boolean)
 * - likeCount: 좋아요 총 개수 (number)
 * - handleLikeToggle: 좋아요 버튼 클릭 핸들러 (function)
 * - viewCount: 조회수 (number)
 * - commentCount: 댓글 총 개수 (number)
 */
export default function PostStat({
  isLiked,
  likeCount,
  handleLikeToggle,
  viewCount,
  commentCount
}) {
  return (
    <div className="post-article__footer">
      {/* 좋아요 토글 영역 */}
      <span 
        className="post-article__stat post-article__stat--clickable" 
        id="likeToggleBtn" 
        onClick={handleLikeToggle}
      >
        <span className={`post-article__like-icon ${isLiked ? 'liked' : ''}`}>
          {isLiked ? '♥' : '♡'}
        </span> 
        좋아요 <span id="likeCountValue">{likeCount}</span>
      </span>
      
      {/* 조회수 영역 */}
      <span className="post-article__stat">
        <svg viewBox="0 0 12 12">
          <path d="M1 6C1 6 2.5 2 6 2s5 4 5 4-1.5 4-5 4-5-4-5-4z" />
          <circle cx="6" cy="6" r="1.5" />
        </svg>
        조회 {viewCount || 0}
      </span>
      
      {/* 댓글수 영역 */}
      <span className="post-article__stat">
        <svg viewBox="0 0 12 12">
          <path d="M1.5 2.5A1 1 0 012.5 1.5h7a1 1 0 011 1V8a1 1 0 01-1 1H7.5L6 11 4.5 9H2.5a1 1 0 01-1-1V2.5z" />
        </svg>
        댓글 <span id="commentCountValue">{commentCount}</span>
      </span>
    </div>
  );
}
