import type { TermsAgreeList } from "@/api/types";

const TERMS_KEY = "signup_termsAgreeList";

export function saveTermsAgreeList(list: TermsAgreeList) {
  // 배열/객체는 문자열로 바꿔서 저장
  sessionStorage.setItem(TERMS_KEY, JSON.stringify(list));
}

export function loadTermsAgreeList(): TermsAgreeList | null {
  const raw = sessionStorage.getItem(TERMS_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TermsAgreeList;
  } catch {
    sessionStorage.removeItem(TERMS_KEY);
    return null;
  }
}

export function clearTermsAgreeList() {
  sessionStorage.removeItem(TERMS_KEY);
}
