import { CheckBoxButton } from "../common/CheckBoxButton";
import type { CheckBoxButtonProps } from "../common/CheckBoxButton";

export const SelectAllConsentButton = ({
  label,
  isChecked,
  onCheckedChange,
}: Pick<CheckBoxButtonProps, "label" | "isChecked" | "onCheckedChange">) => {
  return (
    <div className="flex w-full h-14 items-center border-b border-gray-80">
      <CheckBoxButton
        size="large"
        label={label}
        isChecked={isChecked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
