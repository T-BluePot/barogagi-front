import { useEffect, useState } from "react";

interface UseDebouncedKeywordOptions {
  minLength?: number;
  delay?: number;
}

interface UseDebouncedKeywordParams {
  value: string;
  options?: UseDebouncedKeywordOptions;
}

/**
 * 사용자 입력 키워드를 디바운스 처리하여 반환하는 커스텀 훅
 * @param value - 사용자 입력 키워드
 * @param minLength- 검색을 허용할 최소 글자 수
 * @param delay - 디바운스 지연 시간 (밀리초 단위), 기본값은 300ms
 * @return 디바운스 처리된 키워드
 * 조건을 만족하지 못하면 항상 빈 문자열("")을 반환
 */
export const useDebouncedKeyword = ({
  value,
  options,
}: UseDebouncedKeywordParams): string => {
  const { minLength = 2, delay = 400 } = options ?? {};
  // 실제 검색 카운트 값
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");

  useEffect(() => {
    const trimmedValue = value.trim();

    // 1. 입력값이 허용 글자 수 보다 짧으면 빈 문자열 반환
    if (trimmedValue.length < minLength) {
      setDebouncedKeyword("");
      return;
    }

    // 2. 디바운스 처리
    const timer = setTimeout(() => {
      setDebouncedKeyword(trimmedValue);
    }, delay);

    // 3. 클린업 함수에서 타이머 제거
    return () => clearTimeout(timer);
  }, [value, minLength, delay]);

  return debouncedKeyword;
};
