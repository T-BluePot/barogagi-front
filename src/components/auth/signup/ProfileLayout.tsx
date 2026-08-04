import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";
import { PREFERRED_REGION_TEXT } from "@/constants/texts/common/preferredRegion";
import { useAlertModalStore } from "@/stores/alertModalStore";

import type {
  SelectGenderProps,
  SelectBirthProps,
  SelectRegionProps,
  SkipProfileProps,
  ProfilePageTitleProps,
} from "@/types/profileTypes";

import { SelectGenderBottomModal } from "@/components/auth/signup/SelectGenderBottomModal";
import { SelectBirthBottomModal } from "@/components/auth/signup/SelectBirthBottomModal";
import { SelectRegionBottomModal } from "@/components/auth/signup/SelectRegionBottomModal";
import { SkipProfileModal } from "@/components/auth/signup/SkipProfileModal";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { SelectTriggerButton } from "@/components/auth/common/SelectTriggerButton";
import { CheckBoxButton } from "@/components/auth/common/CheckBoxButton";
import Button from "@/components/common/buttons/CommonButton";

type ProfileLayoutProps = {
  genderProps: SelectGenderProps;
  birthProps: SelectBirthProps;
  regionProps: SelectRegionProps;
  skipProfileProps: SkipProfileProps;
  pageTitle: ProfilePageTitleProps;
  handleGoBack: () => void;

  nickname: string;
  setNickname: (next: string) => void;
  isNicknameError: boolean;
  nicknameHelperText: string | undefined;
  buttonProps?: {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
  };

  genderValue: string | undefined;
  birthValue: string | undefined;
  /** 선호 지역 표시명. 시/도만 고르면 "서울특별시", 시·군·구까지면 "서울특별시 종로구" */
  regionValue: string | undefined;
  handleOpenGenderModal: () => void;
  handleOpenBirthModal: () => void;
  handleOpenRegionModal: () => void;

  isSkipProfile: boolean;

  isDisabled: boolean;
  handleSubmitProfile: () => void;

  hideSkip?: boolean;
  submitLabel?: string;
};

const ProfileLayout = ({
  genderProps,
  birthProps,
  regionProps,
  skipProfileProps,
  pageTitle,
  // 프로필 설정
  nickname,
  setNickname,
  isNicknameError,
  nicknameHelperText,
  buttonProps,

  genderValue,
  birthValue,
  regionValue,
  handleOpenGenderModal,
  handleOpenBirthModal,
  handleOpenRegionModal,
  // 프로필 설정 스킵
  isSkipProfile,
  // 프로필 설정
  isDisabled,
  handleSubmitProfile,

  hideSkip = false,
  submitLabel,
}: ProfileLayoutProps) => {
  // 안내 팝업은 회원가입·OAuth 두 페이지가 공유하는 내용이라
  // 양쪽에 핸들러를 prop 으로 내리지 않고 전역 모달 store 를 직접 쓴다.
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  const handleOpenRegionHelp = () =>
    openAlertModal({
      title: PREFERRED_REGION_TEXT.HELP.TITLE,
      content: PREFERRED_REGION_TEXT.HELP.CONTENT,
    });

  return (
    <div className="flex flex-col w-full h-full">
      {/* 성별 선택 모달 */}
      <SelectGenderBottomModal {...genderProps} />
      {/* 생년월일 선택 모달 */}
      <SelectBirthBottomModal {...birthProps} />
      {/* 선호 지역 선택 모달 (시/도 → 시·군·구 2단계) */}
      <SelectRegionBottomModal {...regionProps} />
      {/* 프로필 설정 스킵 모달 */}
      <SkipProfileModal {...skipProfileProps} />

      {/* 화면 레이아웃 */}
      <div className="flex flex-col w-full px-6">
        <PageTitle {...pageTitle} />
        <div className="flex flex-col w-full gap-4">
          <CommonInput
            label={PROFILE_TEXT.NICKNAME.LABEL}
            placeholder={PROFILE_TEXT.NICKNAME.PLACEHOLDER}
            value={nickname}
            setValue={setNickname}
            withButton={true}
            error={isNicknameError}
            helperText={nicknameHelperText}
            buttonProps={buttonProps}
          />
          <SelectTriggerButton
            label={PROFILE_TEXT.SELECT.GENDER_LABEL}
            onClick={handleOpenGenderModal}
            value={genderValue}
          />
          <SelectTriggerButton
            label={PROFILE_TEXT.SELECT.BIRTH_LABEL}
            onClick={handleOpenBirthModal}
            value={birthValue}
          />
          <SelectTriggerButton
            label={PREFERRED_REGION_TEXT.LABEL}
            onClick={handleOpenRegionModal}
            value={regionValue}
            help={{
              ariaLabel: PREFERRED_REGION_TEXT.HELP.ARIA_LABEL,
              onClick: handleOpenRegionHelp,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-auto  gap-4 p-6">
        {!hideSkip && (
          <CheckBoxButton
            label={PROFILE_TEXT.CHECK_LABEL}
            labelColor="gray"
            gap="tight"
            isChecked={isSkipProfile}
            onCheckedChange={skipProfileProps.handleOpenSkipModal}
          />
        )}
        <Button
          label={submitLabel ?? PROFILE_TEXT.NEXT_BUTTON}
          isDisabled={isDisabled}
          onClick={handleSubmitProfile}
        />
      </div>
    </div>
  );
};

export default ProfileLayout;
