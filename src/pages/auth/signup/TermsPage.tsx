import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { TermsAgreementItem } from "./components/TermsAgreementItem";
import Button from "@/components/common/buttons/CommonButton";

import { CheckBoxButton } from "@/components/auth/common/CheckBoxButton";

const TermsPage = () => {
  const navigate = useNavigate();

  const [isAgreeAll, setIsAgreeAll] = useState(false);
  const [isAgreePrivacy, setIsAgreePrivacy] = useState(false);
  const [isAgreeMarketing, setIsAgreeMarketing] = useState(false);

  useEffect(() => {
    setIsAgreeAll(isAgreePrivacy && isAgreeMarketing);
  }, [isAgreePrivacy, isAgreeMarketing]);

  const handleAgreeAll = () => {
    setIsAgreeAll(!isAgreeAll);
    setIsAgreePrivacy(!isAgreePrivacy);
    setIsAgreeMarketing(!isAgreeMarketing);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader isDarkBg={true} onClick={() => console.log("뒤로 가기")} />
      <div className="flex flex-col flex-1 w-full px-6 items-baseline">
        <span className="typo-title-01 my-[60px] text-white text-left whitespace-pre-line">
          {TERMS_TEXT.title}
        </span>
        <div className="flex flex-col w-full gap-4">
          <CheckBoxButton
            label={TERMS_TEXT.agreeAll}
            size="large"
            isChecked={isAgreeAll}
            setIsChecked={handleAgreeAll}
          />

          <div>
            <TermsAgreementItem
              label={TERMS_TEXT.privacyPolicyRequired}
              isSelected={isAgreePrivacy}
              toggleSelected={() => setIsAgreePrivacy(!isAgreePrivacy)}
              onClick={() => console.log("필수")}
            />
            <TermsAgreementItem
              label={TERMS_TEXT.marketingOptional}
              isSelected={isAgreeMarketing}
              toggleSelected={() => setIsAgreeMarketing(!isAgreeMarketing)}
              onClick={() => console.log("선택")}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto w-full p-6">
        <Button
          label={TERMS_TEXT.nextButton}
          onClick={() => navigate("/signup/credentials")}
        />
      </div>
    </div>
  );
};

export default TermsPage;
