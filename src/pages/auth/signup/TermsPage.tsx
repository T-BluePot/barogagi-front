import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

import { PageTitle } from "@/components/auth/common/PageTitle";
import Button from "@/components/common/buttons/CommonButton";

import { SelectAllConsentButton } from "@/components/auth/signup/SelectAllConsentButton";
import { TermsListSection } from "@/components/auth/signup/TermsListSection";
import { TERMS } from "@/types/termsTypes";
import { ROUTES } from "@/constants/routes";

const TermsPage = () => {
  const navigate = useNavigate();
  const { openAlertModal } = useAlertModalStore();

  // 전체 동의
  const [isAgreeAll, setIsAgreeAll] = useState(false);

  // 약관별 동의 상태 초기화
  const [consents, setConsents] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TERMS.map((term) => [term.id, false]))
  );

  // 토글 핸들러
  const handleToggle = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 상세 보기 핸들러
  const handleOpenDetail = (id: string) => {
    openAlertModal({
      title: "약관 상세",
      content: `약관 전문 보기: ${id}`,
    });
    alert(`약관 전문 보기: ${id}`); // 데모용
  };

  // 전체 동의 상태 제어
  const handleToggleAll = () => {
    const next = !isAgreeAll;
    setIsAgreeAll(next);
    setConsents(Object.fromEntries(TERMS.map((term) => [term.id, next])));
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
    <div className="flex flex-col h-full">
      <div className="flex flex-1 flex-col w-full px-6 items-baseline">
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
          onClick={() => navigate(ROUTES.AUTH.SIGNUP.CREDENTIALS)}
        />
      </div>
    </div>
  );
};

export default TermsPage;
