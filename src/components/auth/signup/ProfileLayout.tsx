import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";

import type {
  SelectGenderProps,
  SelectBirthProps,
  SkipProfileProps,
  ProfilePageTitleProps,
} from "@/types/profileTypes";

import { SelectGenderBottomModal } from "@/components/auth/signup/SelectGenderBottomModal";
import { SelectBirthBottomModal } from "@/components/auth/signup/SelectBirthBottomModal";
import { SkipProfileModal } from "@/components/auth/signup/SkipProfileModal";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { SelectTriggerButton } from "@/components/auth/common/SelectTriggerButton";
import { CheckBoxButton } from "@/components/auth/common/CheckBoxButton";
import Button from "@/components/common/buttons/CommonButton";

type ProfileLayoutProps = {
  genderProps: SelectGenderProps;
  birthProps: SelectBirthProps;
  skipProfileProps: SkipProfileProps;
  pageTitle: ProfilePageTitleProps;
  handleGoBack: () => void;

  nickname: string;
  setNickname: (next: string) => void;
  isNicknameError: boolean;
  nicknameHelperText: string | undefined;
  checkNicknameDuplicate: () => void; // 닉네임 중복 확인 여부

  genderValue: string | undefined;
  birthValue: string | undefined;
  handleOpenGenderModal: () => void;
  handleOpenBirthModal: () => void;

  isSkipProfile: boolean;

  isDisabled: boolean;
  handleSubmitProfile: () => void;
};

const ProfileLayout = ({
  genderProps,
  birthProps,
  skipProfileProps,
  pageTitle,
  // 프로필 설정
  nickname,
  setNickname,
  isNicknameError,
  nicknameHelperText,
  checkNicknameDuplicate,

  genderValue,
  birthValue,
  handleOpenGenderModal,
  handleOpenBirthModal,
  // 프로필 설정 스킵
  isSkipProfile,
  // 프로필 설정
  isDisabled,
  handleSubmitProfile,
}: ProfileLayoutProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* 성별 선택 모달 */}
      <SelectGenderBottomModal {...genderProps} />
      {/* 생년월일 선택 모달 */}
      <SelectBirthBottomModal {...birthProps} />
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
            onClickButton={checkNicknameDuplicate}
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
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-auto  gap-4 p-6">
        <CheckBoxButton
          label={PROFILE_TEXT.CHECK_LABEL}
          labelColor="gray"
          gap="tight"
          isChecked={isSkipProfile}
          onCheckedChange={skipProfileProps.handleOpenSkipModal}
        />
        <Button
          label={PROFILE_TEXT.NEXT_BUTTON}
          isDisabled={isDisabled}
          onClick={handleSubmitProfile}
        />
      </div>
    </div>
  );
};

export default ProfileLayout;
