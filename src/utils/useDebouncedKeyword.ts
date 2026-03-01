import { useEffect, useState } from "react";

interface UseDebouncedKeywordOptions {
  minLength?: number;
  delay?: number;
}

export const useDebouncedKeyword = (
  value: string,
  options?: UseDebouncedKeywordOptions
): string => {
  const { minLength = 2, delay = 300 } = options ?? {};
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");

  useEffect(() => {
    const trimmed = value.trim();

    // 조건 미충족이면 즉시 비우고 끝
    if (trimmed.length < minLength) {
      setDebouncedKeyword("");
      return;
    }

    // 조건 충족이면 delay 후 반영
    const timerId = window.setTimeout(() => {
      setDebouncedKeyword(trimmed);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, minLength, delay]);

  return debouncedKeyword;
};
