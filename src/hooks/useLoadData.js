import { useState, useEffect, useCallback } from 'react';


export default function useLoadData(baseUrl, size = 10) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);


  const loadData = useCallback(async (pageNum) => {
    
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
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
      const items = resJson?.data || [];

      if (items.length < size) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setData((prevData) => {
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

  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
    loadData(0);
  }, [baseUrl]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  }, [page, loading, hasMore, loadData]);

  return { data, loading, error, hasMore, loadMore };
}
