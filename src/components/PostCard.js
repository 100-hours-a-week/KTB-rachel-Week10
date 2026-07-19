import '../css/post-list.css';

export default function PostCard({post, handleClick}) {
    // 게시글 제목, 작성자, 생성날짜, postInfo(좋아요, 댓글, 조회수)
    const truncatedTitle = post.title.length > 26 
            ? post.title.substring(0, 26) + '...' 
            : post.title;

    const formattedDate = post.createdAt 
        ? post.createdAt.replace('T', ' ').substring(0, 19) 
        : '2021-01-01 00:00:00';

    const avatarInitial = post.nickname ? post.nickname.charAt(0) : 'User';

    return (
        <article 
            className="post-card" 
            data-id={post.postId}
            onClick={() => handleClick(post.postId)} // 클릭 시 해당 게시글의 ID를 넘겨줌
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick(post.postId);
                }
            }}
            style={{ cursor: 'pointer' }} // 마우스 올렸을 때 손가락 모양 표시
        >
            <div className="post-card__top">
                <div className="post-card__body">
                    {/* 3. 리액트 변수 출력은 ${}가 아니라 {} 만 사용! */}
                    <h2 className="post-card__title">{truncatedTitle}</h2>
                </div>
            </div>

            <div className="post-card__meta">
                <div className="post-card__author">
                    <div className="post-card__avatar">{avatarInitial}</div>
                    <span className="post-card__author-name">{post.nickname}</span>
                </div>
                
                <span className="post-card__dot">·</span>
                <span className="post-card__date">{formattedDate}</span>
                 
                <div className="post-card__stats">
                    <span className="post-card__stat">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 6C1 6 2.5 2 6 2s5 4 5 4-1.5 4-5 4-5-4-5-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            {/* stroke-width -> strokeWidth 카멜케이스 수정 */}
                            <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {post.viewCount || 0}
                    </span>
                    
                    <span className="post-card__stat">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1.5 2.5A1 1 0 012.5 1.5h7a1 1 0 011 1V8a1 1 0 01-1 1H7.5L6 11 4.5 9H2.5a1 1 0 01-1-1V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                        {post.commentCount || 0}
                    </span>

                    <span className="post-card__stat">
                        <span style={{ fontSize: '10px' }}>♥</span> {/* 리액트 인라인 스타일은 객체 형태여야 함 */}
                        {post.likeCount || 0}
                    </span>
                </div>
            </div>
        </article>
    );
}