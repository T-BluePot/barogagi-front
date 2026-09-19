import { useEffect } from "react";
import toast from "react-hot-toast";
import { consumeForcedLogoutNotice } from "@/utils/auth/handleLogout";
import { SESSION_TEXT } from "@/constants/texts/auth/session";

/**
 * 강제 로그아웃 안내 훅
 *
 * 사용자가 직접 로그아웃한 게 아닌데 로그인 화면으로 돌아온 경우 이유를 알려준다.
 * 안 알려주면 앱을 켰더니 영문도 모르고 로그인 화면에 있는 상태가 된다.
 *
 * 표시는 `handleForcedLogout` 이 sessionStorage 에 남긴다 — 그 함수가 하드 네비게이션으로
 * 끝나 메모리 상태가 전부 날아가기 때문이다. 여기서는 페이지가 새로 뜬 뒤 읽어서 띄운다.
 *
 * 마운트 시 1회만 확인하고, 읽는 즉시 표시를 지운다(같은 안내 반복 방지).
 * 사용자가 직접 누른 로그아웃은 `silent` 로 표시를 남기지 않으므로 여기 걸리지 않는다.
 */
export const useForcedLogoutNotice = () => {
  useEffect(() => {
    if (!consumeForcedLogoutNotice()) return;
    toast(SESSION_TEXT.FORCED_LOGOUT);
  }, []);
};
