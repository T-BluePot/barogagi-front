import type { ReactNode } from "react";
import type { GenderType } from "@/constants/userInfo";
import type { PreferredRegion } from "@/types/regionCode";

/** 성별 선택 모달 타입 */
export interface SelectGenderProps {
  isGenderModalOpen: boolean;
  handleCloseGenderModal: () => void;
  gender: GenderType | undefined;
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

/**
 * 선호 지역 선택 모달 타입
 *
 * `region` 이 `undefined` = 미선택. 선호 지역은 선택 항목이라 정상 상태다.
 * 고른 경우에는 `PreferredRegion` 정의대로 시/도·시·군·구가 항상 함께 채워진다.
 */
export interface SelectRegionProps {
  isRegionModalOpen: boolean;
  handleCloseRegionModal: () => void;
  region: PreferredRegion | undefined;
  setRegion: (region: PreferredRegion | undefined) => void;
  /**
   * "선택 안 함" 항목 노출 여부 (기본 노출).
   *
   * ⚠️ 프로필 수정처럼 **이미 서버에 저장된 값을 고치는 화면에서는 꺼야 한다.**
   *    서버에 선호 지역을 지우는 방법이 없어서(빈 문자열·null 모두 무시됨, 실측)
   *    해제해도 저장되지 않는데 화면만 지워진 것처럼 보인다.
   *    회원가입은 아직 저장 전이라 로컬 상태만 비우면 되므로 그대로 노출한다.
   */
  canClear?: boolean;
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

/**
 * 화면에서 쓰는 회원 정보.
 *
 * `MemberResponseDTO`(서버 응답) 를 `toUserData` 로 변환한 결과다.
 * 서버가 미설정을 빈 문자열·`null` 로 섞어 주는 걸 여기서 전부 `undefined` 로 통일하므로,
 * **화면은 "값이 있으면 설정된 것"으로만 판단하면 된다.**
 */
export interface UserData {
  userId: string;
  nickName: string;
  /** 미설정이면 `undefined` */
  gender?: string;
  /** "YYYYMMDD". 미설정이면 `undefined` */
  birth?: string;
  /** 선호 지역 시/도 코드. 미설정이면 `undefined` */
  areaCd?: string;
  /** 선호 지역 시·군·구 코드. 미설정이면 `undefined` */
  sigunguCd?: string;
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
