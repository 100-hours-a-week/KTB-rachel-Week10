import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import { validatePostTitle, validatePostContent } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.js'; 
import '../css/post-detail.css'; 

export default function PostWrite() {
  const { currentUser } = useAuth(); // [수정 내용 주석] useAuth 훅 사용
  const user = currentUser;
  const userId = currentUser?.userId;
  const { postId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!postId;


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // 유효성 및 헬퍼텍스트 상태
  const [helperText, setHelperText] = useState('*제목, 내용을 모두 작성해주세요.');
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // 수정 모드인 경우 기존 게시글 정보 로드
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const resJson = await response.json();
          setTitle(resJson.data.title || '');
          setContent(resJson.data.content || '');
        }
      } catch (e) {
        console.error("수정할 게시글 정보를 불러오는 데 실패했습니다: ", e);
      }
    };
    fetchPostDetail();
  }, [postId, isEditMode]);

  // 실시간 유효성 검사 및 버튼 활성화 상태 제어
  useEffect(() => {
    const titleError = validatePostTitle(title);
    const contentError = validatePostContent(content);

    if (titleError) {
      setHelperText(`*${titleError}`);
      setIsFormValid(false);
    } else if (contentError) {
      setHelperText(`*${contentError}`);
      setIsFormValid(false);
    } else {
      setHelperText('');
      setIsFormValid(true);
    }
  }, [title, content]);

  // 이미지 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const titleError = validatePostTitle(title);
    const contentError = validatePostContent(content);
    if (titleError || contentError) {
      alert(titleError || contentError);
      return;
    }

    setLoading(true);

    try {
      const url = isEditMode 
        ? `http://localhost:8080/posts/${postId}`
        : `http://localhost:8080/posts/users/${userId}`;

      const method = isEditMode ? 'PATCH' : 'POST';

      // 이미지명 바인딩 // TODO: 11주차 보고 이미지 DB 구축하기
      const imagesList = selectedFile ? [selectedFile.name] : [];

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          images: imagesList
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      alert(isEditMode ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
      navigate('/posts');
    } catch (e) {
      console.error(e);
      alert(isEditMode ? "게시글 수정에 실패했습니다." : "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="post-write-container">
        {/* 수정 모드 여부에 따른 타이틀 분기 */}
        <h1 className="post-write-page-title">
          {isEditMode ? "게시글 수정" : "게시글 작성"}
        </h1>
        
        <form id="postWriteForm" className="post-write-form" onSubmit={handleSubmit}>
          {/* 제목 입력 구역 */}
          <div className="form-group">
            <label htmlFor="postTitleInput" className="form-label">제목*</label>
            <input 
              type="text" 
              id="postTitleInput" 
              className="form-input" 
              placeholder="제목을 입력해주세요. (최대 26글자)" 
              maxLength="26"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 내용 입력 구역 */}
          <div className="form-group">
            <label htmlFor="postContentInput" className="form-label">내용*</label>
            <textarea 
              id="postContentInput" 
              className="form-textarea" 
              placeholder="내용을 입력해주세요." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* 실시간 헬퍼 텍스트 영역 */}
          <div 
            id="writeHelperText" 
            className={`helper-text ${helperText ? '' : 'hidden'}`}
          >
            {helperText}
          </div>

          {/* 이미지 선택 구역 */}
          <div className="form-group margin-top-sm">
            <label className="form-label">이미지</label>
            <div className="file-upload-wrapper">
              <input 
                type="file" 
                id="postImageInput" 
                className="file-input" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              /* [수정 내용 주석] 인라인 스타일을 selected-file-info 클래스로 교체 */
              <span className="selected-file-info">
                선택된 파일: {selectedFile.name}
              </span>
            )}
          </div>

          {/* 완료 버튼 */}
          <div className="form-submit-row">
            <button 
              type="submit" 
              id="postSubmitBtn" 
              className={`btn-submit ${isFormValid ? 'active' : ''}`} 
              disabled={!isFormValid || loading}
            >
              {loading ? "전송 중..." : "완료"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}