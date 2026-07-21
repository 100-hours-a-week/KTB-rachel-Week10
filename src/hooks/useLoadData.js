import { useState, useEffect, useCallback } from 'react';


export default function useLoadData(baseUrl, size = 10) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 데이터를 가져오는 순수 비동기 함수
  const loadData = useCallback(async (pageNum) => {
    // 이미 로딩 중이면 중복 요청 방지
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      // 스프링 부트 페이징 규격인 ?page=N&size=M 형식을 적용하고 최신순(createdAt,desc) 정렬 파라미터를 추가했습니다.
      const url = `${baseUrl}?page=${pageNum}&size=${size}&sort=createdAt,desc`;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resJson = await response.json();
      // 백엔드 감싸진 데이터 형태(resJson.data)에서 실제 게시글 배열을 추출합니다.
      const items = resJson?.data || [];

      // 가져온 데이터 개수가 요청한 size보다 적으면 더이상 긁어올 데이터가 없다고(hasMore = false) 세팅합니다.
      if (items.length < size) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setData((prevData) => {
        // 첫 페이지 로드(pageNum === 0)일 때는 데이터를 갈아끼우고, 그 외에는 누적(append)시킵니다.
        if (pageNum === 0) return items;
        return [...prevData, ...items];
      });
    } catch (e) {
      setError(e);
      console.error("데이터 로드 실패: ", e);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, size]);

  // 첫 페이지 데이터를 로드하거나 baseUrl이 바뀔 때 초기화 효과
  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
    loadData(0);
  }, [baseUrl]);

  // 다음 페이지를 불러오는 트리거 함수
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  }, [page, loading, hasMore, loadData]);

  return { data, loading, error, hasMore, loadMore };
}
