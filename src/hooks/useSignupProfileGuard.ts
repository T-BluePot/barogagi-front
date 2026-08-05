import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSignupStore } from "@/stores/signupStore";
import { ROUTES } from "@/constants/routes";
import { isSignupAccessBypassed } from "@/lib/devSignupAccess";

/**
 * 회원가입 프로필 단계 접근 가드.
 *
 * 약관 → 아이디/비밀번호 → 휴대폰 인증을 거치지 않고 `/auth/signup/profile` 로
 * 직접 진입하면 회원가입 시작(약관) 화면으로 되돌린다.
 *
 * 주의:
 * - signupStore 는 persist(브라우저 sessionStorage / 앱 브릿지=비동기)라, 하이드레이션이
 *   끝나기 전에 검사하면 진행 중인 사용자를 잘못 튕긴다. → onFinishHydration 이후에만 검사한다.
 * - password 는 보안상 persist 에서 제외(partialize)되므로 새로고침 시 사라진다.
 *   따라서 가드 조건에서 password 는 제외하고, 항상 남아 있는 termsDTO·userId·tel 로 판정한다.
 *
 * 개발/QA 편의: `isSignupAccessBypassed()` 가 true 면 검사 없이 통과시킨다
 * (개발 모드 또는 배포 테스트 빌드 + `?devSignup`). `lib/devSignupAccess.ts` 참고.
 *
 * @returns 접근 허용 여부. false 동안에는 페이지 본문을 렌더하지 말 것(검사 중 또는 리다이렉트 대기).
 */
export const useSignupProfileGuard = (): boolean => {
  const navigate = useNavigate();
  const bypassed = isSignupAccessBypassed();
  const draft = useSignupStore((state) => state.draft);
  const [hydrated, setHydrated] = useState(() =>
    useSignupStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useSignupStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useSignupStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    return unsub;
  }, []);

  // 이전 단계(약관·아이디·휴대폰 인증) 완료 여부. password는 persist 제외라 판정에서 뺀다.
  const isCompleted =
    !!draft.termsDTO &&
    typeof draft.userId === "string" &&
    draft.userId.trim().length > 0 &&
    typeof draft.tel === "string" &&
    draft.tel.trim().length > 0;

  useEffect(() => {
    if (bypassed) return;
    if (!hydrated) return;
    if (!isCompleted) {
      navigate(ROUTES.AUTH.SIGNUP.TERMS, { replace: true });
    }
  }, [bypassed, hydrated, isCompleted, navigate]);

  return bypassed || (hydrated && isCompleted);
};
