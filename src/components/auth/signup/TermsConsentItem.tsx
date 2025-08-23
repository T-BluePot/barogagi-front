import { CheckBoxButton } from "../common/CheckBoxButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface TermsConsentItemProps {
  /** 약관 식별자 (예: 'privacy') */
  id: string;
  /** 현재 항목의 동의 여부 */
  isConsented: boolean;
  /** 체크박스 클릭 시 호출 */
  onToggle: (id: string) => void;
  /** 라벨 클릭 시 약관 전문 보기 */
  onOpenDetail: (id: string) => void;
  /** 약관 라벨 텍스트 */
  label: string;
}

export const TermsConsentItem = ({
  id,
  isConsented,
  onToggle,
  onOpenDetail,
  label,
}: TermsConsentItemProps) => {
  return (
    <div className="flex w-full h-12 items-center gap-4">
      <CheckBoxButton
        isChecked={isConsented}
        onCheckedChange={() => onToggle(id)}
      />
      <button
        type="button"
        onClick={() => onOpenDetail(id)}
        className="flex flex-1 items-center justify-between gap-4 cursor-pointer"
      >
        <span className="typo-body text-gray-20 underline">{label}</span>
        <ArrowForwardIosIcon className="size-6 text-gray-40" />
      </button>
    </div>
  );
};
