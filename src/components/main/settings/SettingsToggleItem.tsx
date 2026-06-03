import ToggleSwitch from "@/components/common/buttons/ToggleSwitch";

interface SettingsToggleItemProps {
  /** 설정 항목 라벨 */
  label: string;
  /** 부가 설명 (선택) */
  description?: string;
  /** 켜짐 여부 */
  checked: boolean;
  /** 비활성화 (요청 처리 중 등) */
  disabled?: boolean;
  /** 토글 시 호출 (다음 상태 값을 전달) */
  onChange: (next: boolean) => void;
}

/** 라벨/설명 + 토글 스위치로 구성된 설정 한 줄 */
const SettingsToggleItem = ({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingsToggleItemProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-col gap-1 text-left">
        <span className="typo-body text-gray-black">{label}</span>
        {description && (
          <span className="typo-caption text-gray-50">{description}</span>
        )}
      </div>
      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ariaLabel={label}
      />
    </div>
  );
};

export default SettingsToggleItem;
