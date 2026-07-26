import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import { validatePostTitle, validatePostContent } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.js'; 
import useFetch from '../hooks/useFetch.js';
import { useInput } from '../hooks/useInput.js';
import '../css/post-detail.css'; 

export default function PostWrite() {
  const { currentUser } = useAuth();
  const user = currentUser;
  const userId = currentUser?.userId;
  const { postId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!postId;

  const titleInput = useInput("", validatePostTitle);
  const { setValue: setTitleValue, setError: setTitleError } = titleInput;
  const contentInput = useInput("", validatePostContent);
  const { setValue: setContentValue, setError: setContentError } = contentInput;
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [postData, setPostData] = useState(null);

  const isFormValid =
    titleInput.value.trim() !== '' && !titleInput.error &&
    contentInput.value.trim() !== '' && !contentInput.error;


  const { data: detailData, error: detailError } = useFetch(
    isEditMode ? `http://localhost:8080/posts/${postId}` : null,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    },
    [postId]
  );

  // 기존 게시글 정보 로드 성공 시 input 값 설정
  useEffect(() => {
    if (detailData && detailData.data) {
      const fetchedTitle = detailData.data.title || '';
      const fetchedContent = detailData.data.content || '';
      setTitleValue(fetchedTitle);
      setTitleError(validatePostTitle(fetchedTitle));
      setContentValue(fetchedContent);
      setContentError(validatePostContent(fetchedContent));
    }
  }, [detailData, setTitleValue, setTitleError, setContentValue, setContentError]);

  
  useEffect(() => {
    if (detailError) {
      console.error("수정할 게시글 정보를 불러오는 데 실패했습니다: ", detailError);
      alert("수정할 게시글 정보를 불러오는 데 실패했습니다.");
    }
  }, [detailError]);

  
  const { data: createData, loading: createLoading, error: createError } = useFetch(
    (!isEditMode && postData) ? `http://localhost:8080/posts/users/${userId}` : null,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    },
    [postData]
  );


  const { data: updateData, loading: updateLoading, error: updateError } = useFetch(
    (isEditMode && postData) ? `http://localhost:8080/posts/${postId}` : null,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    },
    [postData]
  );

  useEffect(() => {
    if (createData) {
      alert("게시글이 작성되었습니다.");
      navigate('/posts');
    }
  }, [createData, navigate]);


  useEffect(() => {
    if (updateData) {
      alert("게시글이 수정되었습니다.");
      navigate('/posts');
    }
  }, [updateData, navigate]);

  useEffect(() => {
    if (createError) {
      console.error(createError);
      alert("게시글 작성에 실패했습니다.");
      setPostData(null);
    }
  }, [createError]);

  useEffect(() => {
    if (updateError) {
      console.error(updateError);
      alert("게시글 수정에 실패했습니다.");
      setPostData(null);
    }
  }, [updateError]);

  const loading = createLoading || updateLoading;

  // 이미지 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isFormValid) {
      const imagesList = selectedFile ? [selectedFile.name] : [];
      setPostData({
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        images: imagesList
      });
    } else {
      alert("입력 정보를 다시 확인해 주세요.");
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="post-write-container">
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
              value={titleInput.value}
              onChange={titleInput.onChange}
              required
            />
            {titleInput.error && (
              <p className="field__helper field__helper--error">* {titleInput.error}</p>
            )}
          </div>

          {/* 내용 입력 구역 */}
          <div className="form-group">
            <label htmlFor="postContentInput" className="form-label">내용*</label>
            <textarea 
              id="postContentInput" 
              className="form-textarea" 
              placeholder="내용을 입력해주세요." 
              value={contentInput.value}
              onChange={contentInput.onChange}
              required
            ></textarea>
            {contentInput.error && (
              <p className="field__helper field__helper--error">* {contentInput.error}</p>
            )}
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