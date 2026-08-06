import { CheckBoxButton } from "../common/CheckBoxButton";

interface SelectAllConsentButtonProps {
  label?: string;
  isChecked: boolean;
  onCheckedChange?: () => void;
}

export const SelectAllConsentButton = ({
  label = "",
  isChecked,
  onCheckedChange,
}: SelectAllConsentButtonProps) => {
  return (
    <div className="flex w-full h-14 items-center gap-3 border-b border-gray-20">
      <CheckBoxButton
        size="large"
        isChecked={isChecked}
        onCheckedChange={onCheckedChange}
        ariaLabel={label}
      />
      {/* 라벨을 이 컴포넌트가 직접 그린다(굵기·색이 CheckBoxButton 기본과 다름).
          체크박스 버튼이 이미 같은 이름을 갖고 있어, 이 텍스트를 낭독 대상에서 빼지 않으면
          낭독기가 같은 말을 두 번 읽는다. 클릭은 그대로 동작한다. */}
      <span
        aria-hidden
        className="typo-body font-semibold text-gray-black cursor-pointer select-none"
        onClick={onCheckedChange}
      >
        {label}
      </span>
    </div>
  );
};
