import { useEffect } from "react";

import { getCurrentAppVersion } from "@/utils/appVersion";
import { openExternal } from "@/utils/openExternal";
import { PLAY_STORE_URL } from "@/constants/externalLinks";
import { APP_UPDATE_TEXT } from "@/constants/texts/appUpdate";
import { useConfirmModalStore } from "@/stores/confirmModalStore";

/**
 * 권장(optional) 업데이트 안내를 띄운다.
 *
 * 전용 store·전역 컴포넌트를 만들지 않는다 — `GlobalConfirmModal` 이 `App.tsx` 에 이미 마운트돼 있고
 * 배경 클릭·하드웨어 백 닫기까지 처리한다.
 *
 * ⚠️ 강제(force) 모드는 이 경로를 쓸 수 없다. `GlobalConfirmModal` 이 `useNativeBack` 에
 *    `closeConfirmModal` 을 등록해서 하드웨어 백으로 닫히기 때문이다. 강제 모드는 전용 컴포넌트가 필요하고,
 *    그 컴포넌트는 #113 과 공유하기로 돼 있어 설계 합의가 선행이다.
 *
 * @param latestVersion 서버가 준 최신 버전. 없으면 버전 표기 없이 안내한다(더미값 금지).
 */
export const showOptionalUpdateNotice = (latestVersion?: string): void => {
  useConfirmModalStore.getState().openConfirmModal(
    {
      title: APP_UPDATE_TEXT.OPTIONAL_TITLE,
      content: APP_UPDATE_TEXT.OPTIONAL_CONTENT(latestVersion),
      confirmLabel: APP_UPDATE_TEXT.OPTIONAL_CONFIRM,
      cancelLabel: APP_UPDATE_TEXT.OPTIONAL_CANCEL,
    },
    () => openExternal(PLAY_STORE_URL)
  );
};

/**
 * 부팅 시 앱 버전 체크 훅
 *
 * `useFcmForegroundMessage` 와 같은 "앱 생애 1회" 패턴
 * (빈 deps + `cancelled` 플래그로 StrictMode 이중 마운트 방어).
 *
 * 현재는 **버전 획득과 skip 판정까지만** 한다.
 * 업데이트 필요 여부를 판정할 **임계값 소스가 확정되지 않았다** — 아래 TODO 참고.
 */
export const useAppUpdateCheck = () => {
  useEffect(() => {
    let cancelled = false;

    getCurrentAppVersion().then((currentVersion) => {
      if (cancelled) return;

      // null = 버전 미확인. 웹 브라우저이거나 getAppVersion 이 없는 구버전 앱이다.
      // 이때는 **아무 안내도 띄우지 않는다** — 오탐으로 사용자를 막지 않는다.
      if (!currentVersion) return;

      // ⛔ TODO(#112): 업데이트 필요 여부 판정 미구현 — **임계값을 코드에 넣지 말 것.**
      //
      // 임계값(minVersion / latestVersion) 소스가 아직 확정되지 않았다.
      // 후보 3가지이고 기획 결정 사항이다:
      //   1) 신규 백엔드 API — 42개 경로에 버전 조회가 전무해 경로·인증·응답 협의 필요
      //   2) Firebase Remote Config — firebase 가 이미 의존성이라 백엔드 0줄로 가능
      //   3) Google Play In-App Updates — 앱 레포에서 스토어를 임계값 소스로 사용
      //
      // 확정되면 여기서:
      //   isVersionBelow(currentVersion, minVersion)    → 강제 (전용 컴포넌트, #113 합의 후)
      //   isVersionBelow(currentVersion, latestVersion) → showOptionalUpdateNotice(latestVersion)
      // 조회 실패 시에는 아무 모달도 띄우지 않는다.
      //
      // ⚠️ 닭-달걀: getAppVersion 은 앱을 새로 배포한 뒤부터만 존재한다.
      //    현재 스토어 배포본(1.2.1)에는 없어서 "구버전 강제 업데이트"는 다음 버전부터 유효하다.
      //    getAppVersion 부재를 "최소버전 미달"로 볼지 조용히 skip 할지도 기획 결정 사항이다.
    });

    return () => {
      cancelled = true;
    };
  }, []);
};
