/**
 * undefined 필드를 제거하는 유틸
 * -  서버/로깅 시 지저분해질 수 있기 때문에 미리 값을 제거
 */
export const omitUndefined = <T extends Record<string, unknown>>(obj: T) => {
  const next: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) next[key] = value;
  }

  return next as {
    [K in keyof T as T[K] extends undefined ? never : K]: T[K];
  };
};
