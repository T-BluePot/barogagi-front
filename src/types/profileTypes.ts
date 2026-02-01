import type { ReactNode } from "react";
import type { GenderType } from "@/constants/userInfo";

/** 성별 선택 모달 타입 */
export interface SelectGenderProps {
  isGenderModalOpen: boolean;
  handleCloseGenderModal: () => void;
  gender: GenderType | null;
  setGender: (gender: GenderType) => void;
}

/** 생년월일 선택 모달 타입 */
export interface SelectBirthProps {
  isBirthModalOpen: boolean;
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
export interface ProfilePageTitleProps {
  title: string;
  subTitle?: string;
}

/** 프로필 사용자 정보 타입 */
export interface UserData {
  userId: string;
  nickName: string;
  // 필요한 필드 추가
}

/** 프로필 유저 정보 컴포넌트 Props */
export interface ProfileUserInfoProps {
  nickname: string;
  userId: string;
}

/** 프로필 정보 섹션 컴포넌트 Props */
export interface ProfileInfoSectionProps {
  nickname: string;
  userId: string;
}

/** 프로필 메뉴 아이템 컴포넌트 Props */
export interface ProfileMenuItemProps {
  label: string;
  onClick: () => void;
}

/** 프로필 메뉴 섹션 컴포넌트 Props */
export interface ProfileMenuSectionProps {
  title: string;
  children: ReactNode;
}
