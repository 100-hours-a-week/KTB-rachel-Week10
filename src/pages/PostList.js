import { useState, useCallback, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/post/PostCard.js';
import useLoadData from '../hooks/useLoadData.js'; 
import Header from '../components/Header.js';
import { useAuth } from '../context/AuthContext.js'; 


export default function PostList() {
    const { currentUser } = useAuth(); 
    const user = currentUser;

    const navigate = useNavigate(); 

    // 인피니티 스크롤
    const { data: posts, loading, error, hasMore, loadMore } = useLoadData(
        `http://localhost:8080/posts`, 
        10
    );
    
    const totalPosts = posts ? posts.length : 0;
    const totalLikes = posts ? posts.reduce((acc, curr) => acc + (curr.likeCount || 0), 0) : 0;
    const totalComments = posts ? posts.reduce((acc, curr) => acc + (curr.commentCount || 0), 0) : 0;
    const totalViews = posts ? posts.reduce((acc, curr) => acc + (curr.viewCount || 0), 0) : 0;


    // 무한 스크롤 하단 감지를 위한 ref 생성
    const observerTarget = useRef(null);

    // Intersection Observer를 통해 스크롤 끝에 도달했을 때 loadMore 호출
    useEffect(() => {
        if (!observerTarget.current || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerTarget.current);

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, loadMore]);

    
    // 수정 버튼 클리시 수정 페이지 이동
    const handleClick = useCallback((postId) => {
        navigate(`/post/${postId}`);
    }, [navigate]);

    
    return (
        <div className="post-list-page">
            {/* 상단 공통 헤더 컴포넌트 주입 */}
            <Header user={user} />
            <main className="post-list-main">
                {/* <!-- 페이지 상단 헤더 영역 --> */}
                <header className="post-list-top">
                    <div>
                        <h1 className="post-list-top__heading">전체 게시글</h1>
                        <p className="post-list-top__count" id="postTotalCount">
                            {totalPosts === 0 
                                ? "블루 커뮤니티에 첫 게시글을 작성해봐요!" 
                                : `게시글 ${totalPosts}개 · 좋아요 ${totalLikes}개 · 댓글 ${totalComments}개 · 조회수 ${totalViews}개`
                            }
                        </p>
                    </div>
                    <div className="action-area">
                        <button 
                            type="button" 
                            id="goToPostWriteBtn" 
                            className="btn-write"
                            onClick={() => navigate('/post/write')}
                        >
                            <svg viewBox="0 0 14 14">
                                <path d="M7 1v12M1 7h12" />
                            </svg>
                            게시글 작성
                        </button>
                    </div>
                </header>

                {/* <!-- 실제 게시글 아이템들이 리스트업 --> */}
                {posts && posts.map(post => (
                    <PostCard 
                        key={post.postId} 
                        post={post}                  
                        handleClick={handleClick} 
                    />
                ))}


                <div ref={observerTarget} className="post-list-observer">
                    {loading && <div>게시글을 더 불러오는 중...</div>}
                    {!hasMore && posts.length > 0 && <div>마지막 게시글입니다.</div>}
                    {error && <div>에러가 발생했습니다: {error.message}</div>}
                </div>
            </main>
        </div>
    );
}
