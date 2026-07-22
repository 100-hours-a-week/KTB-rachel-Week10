import React from 'react';

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
