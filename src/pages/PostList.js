import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard.js';
import useFetch from '../hooks/useFetch.js';

export default function PostList() {
    const navigate = useNavigate(); 
    // const [refetchTrigger, setRefetchTrigger] = useState(0);

    const { data: fetchedData, loading, error } = useFetch(
        `http://localhost:8080/posts`, 
        { 
            method: 'GET',
            credentials: 'include', // 쿠키나 인증 정보를 요청에 포함
            headers: {
            'Content-Type': 'application/json'
            }
        }, 
        [] 
    );

    

    // 클릭 시, 라우터이동
    const handleClick = useCallback((postId) => {
        alert(`게시글 ${postId}번을 클릭했습니다.`);
        // navigate(`/post/${postId}`);
    }, []);




    if (loading) return <div>게시글 로딩 중...</div>;
    if (error) return <div>에러가 발생했습니다: {error.message}</div>;

    return (
        // JSX 문법에 맞춰 class -> className으로 수정했습니다.
        <div className="post-list-page">
            <main className="post-list-main">
                {/* <!-- 페이지 상단 헤더 영역 --> */}
                <header className="post-list-top">
                    <div>
                        <h1 className="post-list-top__heading">전체 게시글</h1>
                        <p className="post-list-top__count" id="postTotalCount">
                            블루 커뮤니티에 첫 게시글을 작성해봐요!
                        </p>
                    </div>
                    <div className="action-area">
                        <button type="button" id="goToPostWriteBtn" className="btn-write">
                            {/* <!-- 피그마 + 플러스 아이콘 SVG --> */}
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: '4px' }}>
                                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            게시글 작성
                        </button>
                    </div>
                </header>

                {/* <!-- 실제 게시글 아이템들이 리스트업되는 공간 --> */}
                {fetchedData && fetchedData.map(post => (
                    <PostCard 
                        key={post.postId} 
                        post={post}                  
                        handleClick={handleClick} 
                    />
                ))}
            </main>
        </div>
    );
}
