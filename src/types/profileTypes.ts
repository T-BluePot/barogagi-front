import type { GenderType } from "./auth/gender";

/** 성별 선택 모달 타입 */
export interface SelectGenderProps {
  isGenderModalOpen: boolean;
  handleOpenGenderModal: () => void;
  handleCloseGenderModal: () => void;
  gender: GenderType | null;
  setGender: (gender: GenderType) => void;
}

/** 생년월일 선택 모달 타입 */
export interface SelectBirthProps {
  isBirthModalOpen: boolean;
  handleOpenBirthModal: () => void;
  handleCloseBirthModal: () => void;
  userBirthYear: string;
  userBirthMonth: string;
  userBirthDay: string;
  handleChangeBirth: (value: {
    userBirthYear: string;
    userBirthMonth: string;
    userBirthDay: string;
  }) => void;
}

/** 프로필 설정 스캅 모달 타입 */
export interface SkipProfileProps {
  isSkipModalOpen: boolean;
  handleOpenSkipModal: () => void;
  handleCloseSkipModal: () => void;
  handleSkipProfile: () => void;
}

/** 프로필 설정 화면 타이틀 */
export interface ProfilePageTitlePros {
  title: string;
  subTitle?: string;
}
