import { useEffect } from "react";
import { isLoggedIn } from "@/lib/auth/tokenCache";
import { useFcmStore } from "@/stores/fcmStore";
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
 * ⚠️ 재동기화는 로그인 상태에서만 한다. 미로그인 시 푸시 API 는 401 이고,
 *    인터셉터가 이를 강제 로그아웃으로 처리해 화면이 로그인으로 튕긴다.
 *    미로그인일 때는 대신 **로컬 등록 기록을 비운다** — 이유는 아래 주석 참고.
 *
 * 중복 실행 방지는 `resyncFcmRegistration()` 내부의 in-flight 가드가 담당한다
 * (`visibilitychange` 는 연달아 발생할 수 있다).
 */
export const useFcmRegistrationResync = () => {
  useEffect(() => {
    const run = () => {
      if (!isLoggedIn()) {
        // 세션이 없다 = **서버에 내 등록이 남아 있다고 믿을 근거가 없다.**
        // 로그아웃이든 강제 로그아웃이든 토큰이 그냥 사라졌든, 로그인 화면에 와 있다는 건
        // 그 사이 서버 쪽 등록이 어떻게 됐는지 알 수 없다는 뜻이다.
        // (예: 다른 기기에서 탈퇴하면 이 기기 등록까지 서버에서 지워지는데 여기서는 알 도리가 없다)
        //
        // 로컬 기록을 비워 **다음 로그인 때 반드시 재등록**되게 한다.
        // 비용은 등록 요청 1회뿐이고, 로그인 직후는 원래 등록해야 하는 시점이라 낭비가 아니다.
        //
        // 두 로그아웃 경로(handleUserLogout / handleForcedLogout)는 이미 reset 하지만,
        // 토큰이 조용히 사라져 라우트 가드가 로그인 화면으로 보낸 경우는 아무도 정리하지 않는다.
        const { token, registeredToken } = useFcmStore.getState();
        // 비울 게 있을 때만 — 로그인 화면에 머무는 동안 매 복귀마다 저장소를 쓰지 않도록
        if (token || registeredToken) useFcmStore.getState().reset();
        return;
      }
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
