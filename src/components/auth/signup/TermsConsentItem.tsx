import { CheckBoxButton } from "../common/CheckBoxButton";
import { TERMS_TEXT } from "@/constants/texts/auth/signup/terms";

interface TermsConsentItemProps {
  /** 약관 구분 num */
  termsNum: number;
  /** 약관 라벨 텍스트 */
  title: string;
  /** 현재 항목의 동의 여부 */
  isConsented: boolean;
  /** 체크박스 클릭 시 호출 */
  onToggle: (termsNum: number) => void;
  /** "보기" 클릭 시 약관 전문 보기 */
  onOpenDetail: (termsNum: number) => void;
}

export const TermsConsentItem = ({
  termsNum,
  isConsented,
  onToggle,
  onOpenDetail,
  title,
}: TermsConsentItemProps) => {
  return (
    <div className="flex w-full h-12 items-center gap-3">
      <CheckBoxButton
        isChecked={isConsented}
        onCheckedChange={() => onToggle(termsNum)}
        ariaLabel={title}
      />
      {/* 라벨을 이 컴포넌트가 직접 그린다(flex-1 로 "보기" 버튼을 오른쪽 끝으로 밀어야 함).
          체크박스 버튼이 이미 같은 이름을 갖고 있어, 이 텍스트를 낭독 대상에서 빼지 않으면
          낭독기가 같은 말을 두 번 읽는다. 클릭은 그대로 동작한다. */}
      <span
        aria-hidden
        className="typo-body flex-1 cursor-pointer select-none text-left text-gray-70"
        onClick={() => onToggle(termsNum)}
      >
        {title}
      </span>
      <button
        type="button"
        onClick={() => onOpenDetail(termsNum)}
        className="typo-caption shrink-0 cursor-pointer text-gray-40 underline"
      >
        {TERMS_TEXT.DETAIL_VIEW}
      </button>
    </div>
  );
};
