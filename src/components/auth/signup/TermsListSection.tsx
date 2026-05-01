import { TermsConsentItem } from "./TermsConsentItem";
import type { Term } from "@/types/termsTypes";

interface TermsListSectionProps {
  /** 렌더링할 약관 리스트 */
  terms: Term[];
  /** 약관별 동의 여부 상태 */
  consents: Record<string, boolean>;
  /** 체크박스 토글 콜백 */
  onToggle: (num: number) => void;
  /** 상세 보기 콜백 */
  onOpenDetail: (num: number) => void;
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
          key={term.termsNum}
          termsNum={term.termsNum}
          title={term.title}
          isConsented={!!consents[term.termsNum]}
          onToggle={onToggle}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
};
