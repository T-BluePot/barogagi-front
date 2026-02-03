import { CheckBoxButton } from "../common/CheckBoxButton";

interface TermsConsentItemProps {
  /** 약관 구분 num */
  termsNum: number;
  /** 약관 라벨 텍스트 */
  title: string;
  /** 현재 항목의 동의 여부 */
  isConsented: boolean;
  /** 체크박스 클릭 시 호출 */
  onToggle: (termsNum: number) => void;
  /** 라벨 클릭 시 약관 전문 보기 */
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
    <div className="flex w-full h-12 items-center gap-4 active:bg-gray-90 transition-all duration-300 ease-in-out">
      <CheckBoxButton
        isChecked={isConsented}
        onCheckedChange={() => onToggle(termsNum)}
      />
      <button
        type="button"
        onClick={() => onOpenDetail(termsNum)}
        className="flex flex-1 items-center justify-between gap-4 cursor-pointer"
      >
        <span className="typo-body text-gray-20 underline text-left">
          {title}
        </span>
      </button>
    </div>
  );
};
