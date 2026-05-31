import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getPersistStorage } from "@/utils/bridgeStorage";

/**
 * FCM 토큰 발급/등록 상태 store
 *
 * - token: 단말에서 발급(획득)된 현재 FCM 토큰
 * - registeredToken: 서버에 등록 완료된 토큰 (다음 단계의 등록 API 연동 시 set)
 *   → token !== registeredToken 이면 미등록/토큰 변경으로 보고 재등록 대상.
 * - status: 발급/등록 진행 상태 (UI 표시·중복 등록 방지용)
 *
 * 영속화는 token/registeredToken만 (persistent namespace).
 * status는 휘발 — 앱 재시작 시 항상 "idle"부터 시작해 재동기화가 자연스럽게 일어난다.
 */
export type FcmStatus =
  | "idle" // 아직 발급 시도 전
  | "issued" // 토큰 발급 완료(서버 미등록)
  | "registering" // 서버 등록 진행 중
  | "registered" // 서버 등록 완료
  | "error"; // 발급/등록 실패

interface FcmState {
  token: string | null;
  registeredToken: string | null;
  status: FcmStatus;

  /** 발급된 토큰 저장 (status → "issued") */
  setToken: (token: string) => void;
  /** 등록 진행/상태 갱신 */
  setStatus: (status: FcmStatus) => void;
  /** 서버 등록 완료 마킹 (registeredToken 동기화, status → "registered") */
  markRegistered: (token: string) => void;
  /** 로그아웃 등에서 전체 초기화 */
  reset: () => void;
}

export const useFcmStore = create<FcmState>()(
  persist(
    (set) => ({
      token: null,
      registeredToken: null,
      status: "idle",

      setToken: (token) => set({ token, status: "issued" }),
      setStatus: (status) => set({ status }),
      markRegistered: (token) =>
        set({ registeredToken: token, status: "registered" }),
      reset: () =>
        set({ token: null, registeredToken: null, status: "idle" }),
    }),
    {
      name: "fcm",
      storage: createJSONStorage(() => getPersistStorage("persistent")),
      // status는 영속 불필요 — 재시작 시 idle부터 재동기화
      partialize: (state) => ({
        token: state.token,
        registeredToken: state.registeredToken,
      }),
    }
  )
);
