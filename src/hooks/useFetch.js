import { useEffect, useMemo, useState } from "react";

/**
 * useFetch — 데이터를 비동기적으로 불러오는 Custom Hook
 * 
 * 특징:
 * - fetch API를 활용한 데이터 로드 (GET, POST, PUT, PATCH, DELETE 모두 지원)
 * - 로딩/에러/결과 상태를 관리
 * - 의존성(deps)에 따라 자동 재호출
 * - AbortController로 컴포넌트 언마운트 시 안전한 요청 중단
 * - DELETE, POST 등에서 반환값이 없을 때(204 No Content 등) 발생하는 JSON 파싱 에러 방지
 */
export default function useFetch(url, options, deps = []) {
  
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const serializedOptions = JSON.stringify(options);
  const stableOptions = useMemo(() => options, [serializedOptions]);

  
  useEffect(() => {
    console.log(`url: ${url}`);
    console.log(`현재 state: ${state}`);
    if (!url) return; 

    // AbortController로 fetch 중단 기능 추가
    const controller = new AbortController();
    
    const run = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(url, { ...stableOptions, signal: controller.signal });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        console.log(`응답받은 response: ${text}`);
        const json = text ? JSON.parse(text) : null;
    
        setState({ data: json, loading: false, error: null });
      } catch (e) {
        // 요청이 중단된 경우는 무시
        if (e.name === "AbortError") return;

        // 실패 시: error 갱신 및 로딩 종료
        setState({ data: null, loading: false, error: e });
      }
    };

    // Hook 실행 시 즉시 요청
    run();

    // 컴포넌트 언마운트 시 fetch 요청 중단
    return () => controller.abort();
  }, [url, stableOptions, ...deps]); // 의존성 배열: url, 옵션, 외부 deps 변경 시 다시 실행

  
  return state; // { data, loading, error }
}