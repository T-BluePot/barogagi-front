import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

import { BackHeader } from "@/components/common/headers/BackHeader";
import Button from "@/components/common/buttons/CommonButton";

import { SelectAllConsentButton } from "@/components/auth/signup/SelectAllConsentButton";
import { TermsListSection } from "@/components/auth/signup/TermsListSection";
import { TERMS } from "@/types/termsTypes";

const TermsPage = () => {
  const navigate = useNavigate();

  // 전체 동의
  const [isAgreeAll, setIsAgreeAll] = useState(false);

  // 약관별 동의 상태 초기화
  const [consents, setConsents] = useState<Record<string, boolean>>({
    privacy: false,
    marketing: false,
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

  const handleToggleAll = () => {
    const next = !isAgreeAll; // true ↔ false 반전
    setIsAgreeAll(next); // 전체 플래그 업데이트

    // 동일 값으로 개별 항목 덮어쓰기
    setConsents(
      (prev) =>
        Object.fromEntries(Object.keys(prev).map((k) => [k, next])) as Record<
          string,
          boolean
        >
    );
  };

  useEffect(() => {
    const allChecked = Object.values(consents).every(Boolean);
    if (isAgreeAll !== allChecked) {
      setIsAgreeAll(allChecked);
    }
  }, [consents, isAgreeAll]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader isDarkBg={true} onClick={() => console.log("뒤로 가기")} />
      <div className="flex flex-col flex-1 w-full px-6 items-baseline">
        <span className="typo-title-01 my-[60px] text-white text-left whitespace-pre-line">
          {TERMS_TEXT.title}
        </span>
        <div className="flex flex-col w-full gap-4">
          <SelectAllConsentButton
            label={TERMS_TEXT.agreeAll}
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
          label={TERMS_TEXT.nextButton}
          onClick={() => navigate("/signup/credentials")}
        />
      </div>
    </div>
  );
};

export default TermsPage;
