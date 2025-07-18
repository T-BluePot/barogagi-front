import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import Button from "@/components/common/buttons/CommonButton";

import { SelectAllConsentButton } from "@/components/auth/signup/SelectAllConsentButton";
import { TermsListSection } from "@/components/auth/signup/TermsListSection";
import { TERMS } from "@/types/termsTypes";
import { safeBack } from "@/utils/safeBack";

const TermsPage = () => {
  const navigate = useNavigate();

  // 전체 동의
  const [isAgreeAll, setIsAgreeAll] = useState(false);

  // 약관별 동의 상태 초기화
  const [consents, setConsents] = useState<Record<string, boolean>>({
    PRIVACY: false,
    MARKETING: false,
  });

  // 토글 핸들러
  const handleToggle = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 상세 보기 핸들러
  const handleOpenDetail = (id: string) => {
    // 실제 서비스에서는 모달을 띄우거나 페이지 네비게이션
    alert(`약관 전문 보기: ${id}`); // 데모용
  };

  // 전체 동의 상태 제어
  const handleToggleAll = () => {
    const next = !isAgreeAll;
    setIsAgreeAll(next);
    setConsents({
      PRIVACY: next,
      MARKETING: next,
    });
  };

  useEffect(() => {
    const allChecked = Object.values(consents).every(Boolean);
    setIsAgreeAll(allChecked);
  }, [consents]);

  // 필수 동의 약관 동의 여부 확인 함수
  const hasUncheckedRequiredTerms = (): boolean => {
    return TERMS.some((term) => term.required && !consents[term.id]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/login")}
      />
      <div className="flex flex-col flex-1 w-full px-6 items-baseline">
        <PageTitle title={TERMS_TEXT.TITLE} />
        <div className="flex flex-col w-full gap-4">
          <SelectAllConsentButton
            label={TERMS_TEXT.AGREE_ALL}
            isChecked={isAgreeAll}
            onCheckedChange={handleToggleAll}
          />
          <TermsListSection
            terms={TERMS}
            consents={consents}
            onToggle={handleToggle}
            onOpenDetail={handleOpenDetail}
          />
        </div>
      </div>
      <div className="mt-auto w-full p-6">
        <Button
          label={TERMS_TEXT.NEXT_BUTTON}
          isDisabled={hasUncheckedRequiredTerms()}
          onClick={() => navigate("/signup/credentials")}
        />
			</div>
    </div>
  );
};

export default TermsPage;
