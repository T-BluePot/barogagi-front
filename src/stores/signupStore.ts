import { create } from "zustand";
import type {
  SignupPayloadType,
  RequiredFieldKey,
  OptionalFieldKey,
} from "@/types/signupTypes";
import { SignupFlowError } from "@/utils/auth/SignupFlowError";

// 중간 단계 저장용 타입
type SignupDraft = Partial<SignupPayloadType>;

export type SignupState = {
  draft: SignupDraft;

  // 페이지에서 일부 필드만 업데이트(누적)
  setDraft: (patch: SignupDraft) => void;

  // 특정 필드만 지우고 싶을 때(선택)
  clearField: (key: OptionalFieldKey) => void;

  // 마지막 제출 전에 필수값 검증
  isMinimumReady: () => boolean;

  // 제출 payload 생성(필수값 없으면 throw)
  buildPayload: () => SignupPayloadType;

  // 가입 완료/취소 시 초기화
  reset: () => void;
};

// 초기 트래프트 타입
const initialDraft: SignupDraft = {
  userId: "",
  password: "",
  tel: "",
  nickName: "",
  email: "",
  birth: "",
  gender: undefined,
};

export const useSignupStore = create<SignupState>((set, get) => ({
  draft: initialDraft,

  // 특정 필드 업데이트
  setDraft: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...patch,
      },
    })),

  // 특정 필드 삭제
  clearField: (key) =>
    set((state) => ({
      draft: { ...state.draft, [key]: "" },
    })),

  // 최소 가입 조건 검증용 함수
  isMinimumReady: () => {
    const { userId, password, tel, nickName } = get().draft;

    const hasUserId = typeof userId === "string" && userId.trim().length > 0;
    const hasPassword =
      typeof password === "string" && password.trim().length > 0;
    const hasTel = typeof tel === "string" && tel.trim().length > 0;
    const hasNickName =
      typeof nickName === "string" && nickName.trim().length > 0;

    return hasUserId && hasPassword && hasTel && hasNickName;
  },

  buildPayload: () => {
    const { draft } = get();

    // 필수값 검증
    const userId = (draft.userId ?? "").trim();
    const password = (draft.password ?? "").trim();
    const tel = (draft.tel ?? "").trim();
    const nickName = (draft.nickName ?? "").trim();

    // 누락된 필드 계산
    const missingFields: RequiredFieldKey[] = [];
    if (!userId) missingFields.push("userId");
    if (!password) missingFields.push("password");
    if (!tel) missingFields.push("tel");
    if (!nickName) missingFields.push("nickName");

    if (missingFields.length > 0) {
      throw new SignupFlowError(
        "MISSING_REQUIRED_FIELDS",
        "회원가입 필수 정보가 누락되었습니다.",
        missingFields
      );
    }
    // 선택값은 값이 비어있으면 제외
    const email = (draft.email ?? "").trim();
    const birth = (draft.birth ?? "").trim();
    const gender = draft.gender;

    const payload: SignupPayloadType = {
      userId,
      password,
      tel,
      nickName,
      ...(email ? { email } : {}),
      ...(birth ? { birth } : {}),
      ...(gender ? { gender } : {}),
    };

    return payload;
  },

  reset: () => set(() => ({ draft: initialDraft })),
}));
