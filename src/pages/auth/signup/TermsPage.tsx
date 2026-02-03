import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

// === component ===
import { PageTitle } from "@/components/auth/common/PageTitle";
import Button from "@/components/common/buttons/CommonButton";

import { useAlertModalStore } from "@/stores/alertModalStore";
import { SelectAllConsentButton } from "@/components/auth/signup/SelectAllConsentButton";
import { TermsListSection } from "@/components/auth/signup/TermsListSection";

// === constant ===
import { ROUTES } from "@/constants/routes";

// === server ===
import type { TermsAgreeList } from "@/types/termsTypes";
import { authKeys } from "@/api/keyFactories";
import { getTermsList } from "@/api/queries";
import { saveTermsAgreeList } from "@/utils/sessionStorage/termsAgree";

const TermsPage = () => {
  const navigate = useNavigate();
  const { openAlertModal } = useAlertModalStore();

  // === 약관 조회 관련 ===
  const { data, isLoading, isError } = useQuery({
    queryKey: authKeys.terms(),
    queryFn: () => getTermsList("JOIN-MEMBERSHIP"),
  });

  // 약관 저장
  const terms = useMemo(() => {
    const list = data?.data ?? [];
    // 원본 변경 방지 + sort 기준 정렬
    return list.slice().sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  }, [data?.data]);

  // 약관별 동의 상태 초기화
  const [consents, setConsents] = useState<Record<number, boolean>>(
    () =>
      Object.fromEntries(terms.map((term) => [term.termsNum, false])) as Record<
        number,
        boolean
      >
  );

  // consents 변수 서버 동기화
  useEffect(() => {
    if (terms.length === 0) return;

    setConsents((prev) => {
      const next: Record<number, boolean> = { ...prev };

      for (const t of terms) {
        if (next[t.termsNum] === undefined) {
          next[t.termsNum] = false;
        }
      }

      return next;
    });
  }, [terms]);

  // 개별 요소 약관 동의 핸들러
  const handleToggle = (id: number) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 전체 동의
  const isAgreeAll = useMemo(() => {
    if (terms.length === 0) return false;
    return terms.every((t) => consents[t.termsNum] === true);
  }, [terms, consents]);

  // 상세 보기 핸들러 - 모달창으로 약관명 / 약관 내용 확인
  const handleOpenDetail = (termsNum: number) => {
    const found = terms.find((t) => t.termsNum === termsNum);
    if (!found) return;

    openAlertModal({
      title: found.title,
      content: found.contents,
    });
  };

  // 전체 동의 상태 제어
  const handleToggleAll = () => {
    if (terms.length === 0) return;

    const next = !isAgreeAll;
    const nextConsents: Record<number, boolean> = {};

    for (const t of terms) {
      nextConsents[t.termsNum] = next;
    }

    setConsents(nextConsents);
  };

  // 필수 동의 약관 동의 여부 확인 함수
  const hasUncheckedRequiredTerms = useMemo(() => {
    return terms.some(
      (term) => term.essentialYn === "Y" && consents[term.termsNum] !== true
    );
  }, [terms, consents]);

  // 다음 버튼 클릭 핸들러
  const handleAgreeTerms = () => {
    // 필수 약관 미동의면 막기 (버튼 disabled라 보통 안 타지만, 안전장치)
    if (hasUncheckedRequiredTerms) {
      openAlertModal({
        title: "필수 약관 동의 필요",
        content: "필수 약관에 동의해야 다음 단계로 진행할 수 있습니다.",
      });
      return;
    }

    // consents -> TermsAgreeList 변환
    const termsAgreeList: TermsAgreeList = terms.map((t) => ({
      termsNum: t.termsNum,
      agreeYn: consents[t.termsNum] === true ? "Y" : "N",
    }));

    // sessionStorage에 저장
    saveTermsAgreeList(termsAgreeList);

    // 다음 회원가입 단계로 이동
    navigate(ROUTES.AUTH.SIGNUP.CREDENTIALS);
  };

  if (isLoading) {
    /**
     * TODO: 추후 스켈레톤 컴포넌트로 수정
     */
    return (
      <div className="flex flex-col h-full">약관을 불러오는 중입니다...</div>
    );
  }

  if (isError) {
    /**
     * TODO: Error 전용 페이지 추가
     */
    return (
      <div className="flex flex-col h-full">약관을 불러오지 못했습니다.</div>
    );
  }

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
            terms={terms}
            consents={consents}
            onToggle={handleToggle}
            onOpenDetail={handleOpenDetail}
          />
        </div>
      </div>
      <div className="mt-auto w-full p-6 flex justify-center">
        <Button
          label={TERMS_TEXT.NEXT_BUTTON}
          isDisabled={hasUncheckedRequiredTerms}
          onClick={handleAgreeTerms}
        />
      </div>
    </div>
  );
};

export default TermsPage;
