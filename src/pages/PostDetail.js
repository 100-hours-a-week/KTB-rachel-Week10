import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateComment} from '../utils/validators.js';
import Header from '../components/Header.js';
import CommentSection from '../components/comment/commentSection.js'; 
import PostStat from '../components/post/PostStat.js';
import Modal from '../components/Modal.js';   
import ImageSlider from '../components/post/ImageSlider.js';
import { useAuth } from '../context/AuthContext.js';
import useFetch from '../hooks/useFetch.js';
import '../css/post-detail.css';

export default function PostDetail() {
  const { currentUser } = useAuth();
  const user = currentUser;
  const userId = currentUser?.userId;

  const { postId } = useParams();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [commentInput, setCommentInput] = useState('');
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [commentTrigger, setCommentTrigger] = useState(0);
  const [likeTrigger, setLikeTrigger] = useState(0);

  const [deletePostPayload, setDeletePostPayload] = useState(null);
  const [likeTogglePayload, setLikeTogglePayload] = useState(null);
  const [createCommentPayload, setCreateCommentPayload] = useState(null);
  const [editCommentPayload, setEditCommentPayload] = useState(null);
  const [deleteCommentPayload, setDeleteCommentPayload] = useState(null);
  
  // 게시글 조회
  const { data: postDetailData, loading: postLoading, error: postError } = useFetch(
    `/posts/${postId}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    },
    [postId, likeTrigger, commentTrigger]
  );

  // 게시글 삭제
  const { data: deletePostResult, error: deletePostError } = useFetch(
    deletePostPayload ? `/posts/${postId}` : null,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deletePostPayload)
    },
    [deletePostPayload]
  );

  // 좋아요 토글 요청 (POST/DELETE)
  const { data: likeToggleResult, error: likeToggleError } = useFetch(
    likeTogglePayload ? `/posts/${postId}/${userId}/likes` : null,
    {
      method: isLiked ? 'DELETE' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: isLiked ? null : JSON.stringify(likeTogglePayload)
    },
    [likeTogglePayload]
  );

  // 댓글 생성
  const { data: createCommentResult, error: createCommentError } = useFetch(
    createCommentPayload ? `/posts/${postId}/comments` : null,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createCommentPayload)
    },
    [createCommentPayload]
  );

  // 댓글 수정
  const { data: editCommentResult, error: editCommentError } = useFetch(
    editCommentPayload ? `/posts/${postId}/comments/${editCommentPayload.commentId}` : null,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCommentPayload?.body)
    },
    [editCommentPayload]
  );

  // 댓글 삭제
  const { data: deleteCommentResult, error: deleteCommentError } = useFetch(
    deleteCommentPayload ? `/posts/${postId}/comments/${deleteCommentPayload.commentId}` : null,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deleteCommentPayload?.body)
    },
    [deleteCommentPayload]
  );

  const post = postDetailData?.data || null;
  const comments = postDetailData?.data?.comments || [];
  const loading = postLoading && !postDetailData;
  const chatRoomId = postDetailData?.data?.roomId;
  const hasChatRoom = !!chatRoomId;
  const error = postError;

  /* 후속처리 useEffect */

  // 좋아요 수 동기화
  useEffect(() => {
    if (postDetailData?.data) {
      setLikeCount(postDetailData.data.likeCount || 0);
    }
  }, [postDetailData]);

  // 좋아요 토글 상태 초기화
  useEffect(() => {
    if (userId) {
      const likedInStorage = localStorage.getItem(`post_${postId}_liked_by_${userId}`) === 'true';
      setIsLiked(likedInStorage);
    }
  }, [postId, userId]);

  
  useEffect(() => {
    if (deletePostResult) {
      alert("게시글이 삭제되었습니다.");
      navigate('/posts');
    }
  }, [deletePostResult, navigate]);

  useEffect(() => {
    if (deletePostError) {
      console.error(deletePostError);
      alert("게시글 삭제에 실패했습니다.");
      setDeletePostPayload(null);
    }
  }, [deletePostError]);

  // 좋아요 토글 결과 처리
  useEffect(() => {
    if (likeToggleResult) {
      const newLikeNum = likeToggleResult.data.likeInfo.likeNum;
      setLikeCount(newLikeNum);
      setIsLiked(prev => {
        const nextLiked = !prev;
        localStorage.setItem(`post_${postId}_liked_by_${userId}`, String(nextLiked));
        return nextLiked;
      });
      setLikeTrigger(prev => prev + 1);
      setLikeTogglePayload(null);
    }
  }, [likeToggleResult, postId, userId]);

  useEffect(() => {
    if (likeToggleError) {
      console.error("좋아요 처리 실패: ", likeToggleError);
      alert("좋아요 처리에 실패했습니다.");
      setLikeTogglePayload(null);
    }
  }, [likeToggleError]);

  // 댓글 생성 결과 처리
  useEffect(() => {
    if (createCommentResult) {
      setCommentInput('');
      setCommentTrigger(prev => prev + 1);
      setLikeTrigger(prev => prev + 1);
      setCreateCommentPayload(null);
    }
  }, [createCommentResult]);

  useEffect(() => {
    if (createCommentError) {
      console.error(createCommentError);
      alert("댓글 등록에 실패했습니다.");
      setCreateCommentPayload(null);
    }
  }, [createCommentError]);

  // 댓글 수정 결과 처리
  useEffect(() => {
    if (editCommentResult) {
      setEditingCommentId(null);
      setEditCommentValue('');
      setCommentTrigger(prev => prev + 1);
      setEditCommentPayload(null);
    }
  }, [editCommentResult]);

  useEffect(() => {
    if (editCommentError) {
      console.error(editCommentError);
      alert("댓글 수정에 실패했습니다.");
      setEditCommentPayload(null);
    }
  }, [editCommentError]);

  // 댓글 삭제 결과 처리
  useEffect(() => {
    if (deleteCommentResult) {
      setCommentToDelete(null);
      setCommentTrigger(prev => prev + 1);
      setLikeTrigger(prev => prev + 1);
      setDeleteCommentPayload(null);
    }
  }, [deleteCommentResult]);

  useEffect(() => {
    if (deleteCommentError) {
      console.error(deleteCommentError);
      alert("댓글 삭제에 실패했습니다.");
      setDeleteCommentPayload(null);
    }
  }, [deleteCommentError]);

  // 핸들러 함수들
  const handleEditPost = (e) => {
    e.preventDefault();
    if (String(post?.authorId) === String(userId)) {
      navigate(`/post/write/${postId}`);
    } else {
      alert("본인이 작성한 글이 아닙니다.");
    }
  };

  const handleConfirmDeletePost = () => {
    setDeletePostPayload({ userId: Number(userId) });
    setIsDeletePostModalOpen(false);
  };

  const handleLikeToggle = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    setLikeTogglePayload(isLiked ? {} : { isLike: true });
  };

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const errorMsg = validateComment(commentInput);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    setCreateCommentPayload({
      commentContent: commentInput.trim(),
      userId: Number(userId)
    });
  };

  const handleSaveEditComment = (commentId) => {
    const errorMsg = validateComment(editCommentValue);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    setEditCommentPayload({
      commentId,
      body: {
        commentContent: editCommentValue.trim(),
        userId: Number(userId)
      }
    });
  };

  const handleConfirmDeleteComment = () => {
    if (!commentToDelete) return;
    setDeleteCommentPayload({
      commentId: commentToDelete.commentId,
      body: {
        userId: Number(userId)
      }
    });
    setIsDeleteCommentModalOpen(false);
  };

  const handleGoToChat = useCallback(() => {
    if (chatRoomId) {
      navigate(`/chat-detail/${chatRoomId}`);
    }
  }, [chatRoomId, navigate]);


  if (loading) return <div className="post-detail-loading">로딩 중...</div>;
  if (error) return <div className="post-detail-error">에러가 발생했습니다: {error.message}</div>;
  if (!post) return <div className="post-detail-empty">게시글이 존재하지 않습니다.</div>;

  const avatarInitial = post.nickname ? post.nickname.charAt(0) : 'U';
  const formattedDate = post.createdAt ? post.createdAt.replace('T', ' ').substring(0, 19) : '';

  return (
    <>
      <div className="post-detail-page">
        <Header user={user} />
        <main className="post-detail-main">
          
          <button type="button" id="goToPostsBtn" className="back-btn" onClick={() => navigate('/posts')}>
            <svg viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" />
            </svg>
            목록으로
          </button>

          {/* 본문 아티클 카드 */}
          <article className="post-article">
            <header className="post-article__header">
              <h1 className="post-article__title">{post.title}</h1>
              
              {/* 작성자 프로필 + 액션 버튼 행 */}
              <div className="post-article__byline">
                <div className="post-article__author">
                  <div className="post-article__avatar">{avatarInitial}</div>
                  <div>
                    <p className="post-article__author-name">{post.nickname || '작성자'}</p>
                    <p className="post-article__author-date">{formattedDate}</p>
                  </div>
                </div>
                
                
                {String(post.authorId) === String(userId) && (
                  <div className="post-article__actions">
                    <button type="button" id="editPostBtn" className="btn-edit" onClick={handleEditPost}>
                      <svg viewBox="0 0 13 13">
                        <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" />
                      </svg>
                      수정
                    </button>
                    <button type="button" id="deletePostBtn" className="btn-delete" onClick={() => setIsDeletePostModalOpen(true)}>
                      <svg viewBox="0 0 13 13">
                        <path d="M2 3.5h9M4.5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5 6v4M8 6v4M3 3.5l.5 7a.5.5 0 00.5.5h5a.5.5 0 00.5-.5l.5-7" />
                      </svg>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </header>

            <hr className="post-article__divider" />

            <div className="post-article__content">
              {post.images && post.images.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <ImageSlider images={post.images} />
                </div>
              )}
              <div className="post-article__paragraph">{post.content}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <PostStat 
                isLiked={isLiked}
                likeCount={likeCount}
                handleLikeToggle={handleLikeToggle}
                viewCount={post.viewCount}
                commentCount={comments.length}
              />
              {hasChatRoom && (
                <button type="button" id="goToChat" className="btn-chat-practice" onClick={handleGoToChat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  채팅으로 연습하기
                </button>
              )}
            </div>
          </article>

          <CommentSection
            comments={comments}
            user={user}
            userId={userId}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleCreateComment={handleCreateComment}
            editingCommentId={editingCommentId}
            editCommentValue={editCommentValue}
            setEditCommentValue={setEditCommentValue}
            onEditClick={(c) => {
              setEditingCommentId(c.commentId);
              setEditCommentValue(c.content);
            }}
            onDeleteClick={(c) => {
              setCommentToDelete(c);
              setIsDeleteCommentModalOpen(true);
            }}
            onEditSave={handleSaveEditComment}
            onEditCancel={() => {
              setEditingCommentId(null);
              setEditCommentValue('');
            }}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            commentsPerPage={commentsPerPage}
          />
        </main>
      </div>

      {/* 게시글 삭제 모달 */}
      <Modal
        isOpen={isDeletePostModalOpen}
        title="게시글을 삭제하겠습니까?"
        subtitle="삭제한 내용은 복구 할 수 없습니다."
        confirmText="확인"
        cancelText="취소"
        isDanger={true}
        onClose={() => setIsDeletePostModalOpen(false)}
        onConfirm={handleConfirmDeletePost}
      />

      {/* 댓글 삭제 모달 */}
      <Modal
        isOpen={isDeleteCommentModalOpen}
        title="댓글을 삭제하시겠습니까?"
        subtitle="삭제된 댓글은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDanger={true}
        onClose={() => {
          setIsDeleteCommentModalOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleConfirmDeleteComment}
      />
    </>
  );
}
