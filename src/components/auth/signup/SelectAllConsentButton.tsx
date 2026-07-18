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
      />
      <span className="typo-body font-semibold text-gray-black">{label}</span>
    </div>
  );
};
