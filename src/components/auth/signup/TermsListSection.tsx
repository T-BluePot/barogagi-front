import { TermsConsentItem } from "./TermsConsentItem";

/** 약관 메타데이터 */
export interface Term {
  id: "privacy" | "marketing"; // 식별자
  label: string; // UI에 표시될 텍스트
  required: boolean; // 필수 여부
}

interface TermsListSectionProps {
  /** 렌더링할 약관 리스트 */
  terms: Term[];
  /** 약관별 동의 여부 상태 */
  consents: Record<string, boolean>;
  /** 체크박스 토글 콜백 */
  onToggle: (id: string) => void;
  /** 상세 보기 콜백 */
  onOpenDetail: (id: string) => void;
}

export const TermsListSection = ({
  terms,
  consents,
  onToggle,
  onOpenDetail,
}: TermsListSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {terms.map((term) => (
        <TermsConsentItem
          key={term.id}
          id={term.id}
          label={term.label}
          isConsented={!!consents[term.id]}
          onToggle={onToggle}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
};
