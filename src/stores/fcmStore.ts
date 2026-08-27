import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getPersistStorage } from "@/utils/bridgeStorage";

/**
 * FCM 토큰 발급/등록 상태 store
 *
 * - token: 단말에서 발급(획득)된 현재 FCM 토큰
 * - registeredToken: 서버에 등록 완료된 토큰 (다음 단계의 등록 API 연동 시 set)
 *   → token !== registeredToken 이면 미등록/토큰 변경으로 보고 재등록 대상.
 * - registeredDeviceId: 그 등록에 함께 보낸 기기 식별자
 *   → 토큰·버전이 그대로여도 기기 식별자가 바뀌면 서버에는 다른 기기의 등록이 남으므로 재등록 대상.
 * - registeredAppVersion: 그 등록에 함께 보낸 appVersion
 *   → 토큰이 그대로여도 앱 버전이 바뀌면 재등록해야 하므로 함께 보관한다.
 * - status: 발급/등록 진행 상태 (UI 표시·중복 등록 방지용)
 *
 * 영속화는 token/registeredToken/registeredDeviceId/registeredAppVersion만 (persistent namespace).
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
  /**
   * 서버 등록 시 함께 보낸 기기 식별자(deviceId). 기기 변경 감지용.
   *
   * 토큰·앱버전이 그대로여도 deviceId 가 달라졌다면 서버에는 **다른 기기의 등록**이 남아 있는
   * 상태다. 예: 저장소 읽기 실패로 임시 식별자가 쓰였다가 원래 값으로 복귀한 경우.
   * 이때 재등록을 건너뛰면 서버가 현재 기기를 영영 모른다 → 중복 등록 판정에 반드시 포함한다.
   */
  registeredDeviceId: string | null;
  /**
   * 서버 등록 시 함께 보낸 appVersion. 버전 변경 감지용.
   *
   * 버전을 알 수 없는 환경(브라우저·구버전 앱)에서는 `undefined` 다 — `""` 로 채우지 않는다
   * (CLAUDE.md: absent 필드에 더미값 금지). 등록 시 보낸 값과 **같은 표현**이어야
   * 중복 등록 판정이 맞아떨어지므로 `null` 이 아니라 `undefined` 로 맞춘다.
   */
  registeredAppVersion: string | undefined;
  status: FcmStatus;

  /** 발급된 토큰 저장 (status → "issued") */
  setToken: (token: string) => void;
  /** 등록 진행/상태 갱신 */
  setStatus: (status: FcmStatus) => void;
  /** 서버 등록 완료 마킹 (registeredToken/DeviceId/AppVersion 동기화, status → "registered") */
  markRegistered: (
    token: string,
    deviceId: string,
    appVersion: string | undefined
  ) => void;
  /** 로그아웃 등에서 전체 초기화 */
  reset: () => void;
}

export const useFcmStore = create<FcmState>()(
  persist(
    (set) => ({
      token: null,
      registeredToken: null,
      registeredDeviceId: null,
      registeredAppVersion: undefined,
      status: "idle",

      setToken: (token) => set({ token, status: "issued" }),
      setStatus: (status) => set({ status }),
      markRegistered: (token, deviceId, appVersion) =>
        set({
          registeredToken: token,
          registeredDeviceId: deviceId,
          registeredAppVersion: appVersion,
          status: "registered",
        }),
      reset: () =>
        set({
          token: null,
          registeredToken: null,
          registeredDeviceId: null,
          registeredAppVersion: undefined,
          status: "idle",
        }),
    }),
    {
      name: "fcm",
      storage: createJSONStorage(() => getPersistStorage("persistent")),
      // status는 영속 불필요 — 재시작 시 idle부터 재동기화
      partialize: (state) => ({
        token: state.token,
        registeredToken: state.registeredToken,
        registeredDeviceId: state.registeredDeviceId,
        registeredAppVersion: state.registeredAppVersion,
      }),
    }
  )
);
