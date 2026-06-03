import clsx from "clsx";

export interface ToggleSwitchProps {
  /** 켜짐 여부 */
  checked: boolean;
  /** 토글 시 호출 (다음 상태 값을 전달) */
  onChange: (next: boolean) => void;
  /** 비활성화 (요청 처리 중 등) */
  disabled?: boolean;
  /**
   * 스크린리더용 라벨
   * - 텍스트 없는 인터랙티브 요소이므로 필수 (접근성 원칙)
   */
  ariaLabel: string;
}

/**
 * 켜짐/꺼짐 토글 스위치 (공통)
 * - role="switch" + aria-checked 로 상태를 전달
 * - 켜짐: main 컬러 트랙 / 꺼짐: gray-30 트랙
 */
export const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-main" : "bg-gray-30",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
};

export default ToggleSwitch;
