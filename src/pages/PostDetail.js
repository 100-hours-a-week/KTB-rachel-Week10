import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateComment} from '../utils/validators.js';
import Header from '../components/Header.js';
import CommentSection from '../components/comment/commentSection.js'; // [수정 내용 주석] 분리한 CommentSection 컴포넌트로 변경하여 임포트
import PostStat from '../components/post/PostStat.js'; // [수정 내용 주석] 분리한 PostStat 컴포넌트 임포트 추가
import Modal from '../components/Modal.js';     // [수정 내용 주석] 공통 모달 컴포넌트 임포트
import { useAuth } from '../context/AuthContext.js'; // [수정 내용 주석] useAuth 임포트 추가
import '../css/post-detail.css';

export default function PostDetail() {
  const { currentUser } = useAuth();
  const user = currentUser;
  const userId = currentUser?.userId;

  const { postId } = useParams();
  const navigate = useNavigate();

  // 게시글 관련 상태
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 좋아요 관련 상태
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 관련 상태
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  
  // 댓글 수정 모드 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState('');

  // 댓글 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  // 삭제 모달 상태
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // 게시글 상세 조회 API 호출
  const fetchPostDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resJson = await response.json();
      
      setPost(resJson.data);
      setLikeCount(resJson.data.likeCount || 0);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 댓글 목록 조회 API 호출
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resJson = await response.json();
      setComments(resJson.data.comments || []);
    } catch (e) {
      console.error(e);
    }
  }, [postId]);

  // 좋아요 상태값 연동 (로컬 스토리지 흔적 확인)
  const fetchLikeInfo = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/likes`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const resJson = await response.json();
        setLikeCount(resJson.data.likeNum);
        
        // 새로고침 시에도 사용자가 이 글에 좋아요를 눌렀었는지 임시 저장소에서 확인해 상태 매핑
        const likedInStorage = localStorage.getItem(`post_${postId}_liked_by_${userId}`) === 'true';
        setIsLiked(likedInStorage);
      }
    } catch (e) {
      console.error(e);
    }
  }, [postId, userId]);

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
    fetchLikeInfo();
  }, [fetchPostDetail, fetchComments, fetchLikeInfo]);

  // 게시글 수정 페이지 이동 (작성자 검증 포함)
  const handleEditPost = (e) => {
    e.preventDefault();
    if (String(post?.authorId) === String(userId)) {
      navigate(`/post/write/${postId}`);
    } else {
      alert("본인이 작성한 글이 아닙니다.");
    }
  };

  // 게시글 삭제 요청 (DELETE)
  const handleConfirmDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId) })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      alert("게시글이 삭제되었습니다.");
      navigate('/posts');
    } catch (e) {
      console.error(e);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeletePostModalOpen(false);
    }
  };

  // 좋아요 토글 (POST/DELETE)
  const handleLikeToggle = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const url = `http://localhost:8080/posts/${postId}/${userId}/likes`;
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const body = isLiked ? null : JSON.stringify({ isLike: true });
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resJson = await response.json();
      
      const newLikeNum = resJson.data.likeInfo.likeNum;
      setLikeCount(newLikeNum);
      setIsLiked(!isLiked);
      localStorage.setItem(`post_${postId}_liked_by_${userId}`, String(!isLiked));
    } catch (e) {
      console.error("좋아요 처리 실패: ", e);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 생성 요청 (POST)
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    // [수정 내용 주석] validator.js를 통한 댓글 입력 검사
    const errorMsg = validateComment(commentInput);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentContent: commentInput.trim(),
          userId: Number(userId)
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      setCommentInput('');
      fetchComments();
      fetchPostDetail(); // 총 댓글 개수 갱신
    } catch (e) {
      console.error(e);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정 요청 (PATCH)
  const handleSaveEditComment = async (commentId) => {
    // validator.js를 통한 댓글 수정 검사
    const errorMsg = validateComment(editCommentValue);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentContent: editCommentValue.trim(),
          userId: Number(userId)
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      setEditingCommentId(null);
      setEditCommentValue('');
      fetchComments();
    } catch (e) {
      console.error(e);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 요청 (DELETE)
  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentToDelete.commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId)
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      setCommentToDelete(null);
      fetchComments();
      fetchPostDetail(); // 총 댓글 개수 갱신
    } catch (e) {
      console.error(e);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setIsDeleteCommentModalOpen(false);
    }
  };


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
              {post.images && post.images.map((img, idx) => (
                img && <img key={idx} src={`http://localhost:8080/images/${img}`} alt="게시글 이미지" className="post-article__image" />
              ))}
              <div className="post-article__paragraph">{post.content}</div>
            </div>

            <PostStat 
              isLiked={isLiked}
              likeCount={likeCount}
              handleLikeToggle={handleLikeToggle}
              viewCount={post.viewCount}
              commentCount={comments.length}
            />
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
