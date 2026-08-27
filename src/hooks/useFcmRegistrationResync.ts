import { useEffect } from "react";
import { isLoggedIn } from "@/lib/auth/tokenCache";
import { resyncFcmRegistration } from "@/utils/fcm";

/**
 * FCM 등록 재동기화 훅
 *
 * 서버에 등록된 정보와 현재 단말 상태를 대조해 어긋난 부분을 맞춘다.
 * 실제 처리는 `resyncFcmRegistration()` 가 하고, 이 훅은 **언제 확인할지**만 정한다.
 *
 * 처리 대상 세 가지 (자세한 내용은 `resyncFcmRegistration` 주석 참고):
 *   1) 레거시(`"WEB"`) 등록 정리 — 배포 직후 1회
 *   2) 기기 식별자 승격 (`local` → `native`)
 *   3) FCM 토큰 로테이션 재등록
 *
 * 확인 시점 두 가지:
 *   1) 마운트 직후 — 앱을 껐다 켠 경우. 토큰 등록은 로그인 시점에만 일어나므로,
 *      이미 로그인된 상태로 부팅하면 아무도 재확인하지 않는다.
 *   2) 포그라운드 복귀(`visibilitychange`) — 앱을 켜 둔 채 토큰이 갱신된 경우.
 *      실기기에서 토큰 로테이션을 알려주는 네이티브 `onNewToken` 콜백을
 *      WebView 안의 웹은 볼 수 없어, 이 폴링이 유일한 감지 경로다.
 *
 * ⚠️ 로그인 상태에서만 호출한다. 미로그인 시 푸시 API 는 401 이고,
 *    인터셉터가 이를 강제 로그아웃으로 처리해 화면이 로그인으로 튕긴다.
 *
 * 중복 실행 방지는 `resyncFcmRegistration()` 내부의 in-flight 가드가 담당한다
 * (`visibilitychange` 는 연달아 발생할 수 있다).
 */
export const useFcmRegistrationResync = () => {
  useEffect(() => {
    const run = () => {
      if (!isLoggedIn()) return;
      void resyncFcmRegistration();
    };

    /**
     * `visibilitychange` 는 **숨겨질 때도** 발생한다 → 복귀했을 때만 확인한다.
     * (숨김 전환 시에도 돌리면 백그라운드에서 불필요한 브릿지/네트워크 호출이 난다)
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      run();
    };

    // 마운트 직후 1회. 가시성은 따지지 않는다 — 여기서의 목적은 "복귀 감지"가 아니라
    // "부팅 시 재확인"이라, 초기 visibilityState 가 hidden 이라고 건너뛰면
    // 다음 포그라운드 전환이 있을 때까지 영영 확인하지 못한다.
    run();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
};
