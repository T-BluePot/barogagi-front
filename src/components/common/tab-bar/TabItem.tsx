import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

interface TabItemProps {
  variant: TabVariant; // 어떤 탭인지
  isActive: boolean; // 현재 활성 상태
}

/**
 * 하단 탭바 개별 탭 (아이콘 22px + 라벨 11px, 세로 gap 4px)
 * - 활성: 아이콘 fill + 라벨 700, Sunset Peach(#FF8A65)
 * - 비활성: 아이콘 stroke(1.7)만 + 라벨 500, 회색(#767676)
 * - 상태 전환은 컬러 변화만 200ms (스케일/바운스 금지)
 */
export const TabItem = ({
  variant = "home",
  isActive = false,
}: TabItemProps) => {
  const iconProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: isActive ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: isActive ? 1.4 : 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <div
      className={`flex flex-col items-center gap-1 py-2 transition-colors duration-200 ease-fitpl ${
        isActive ? "text-peach" : "text-gray-50"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {variant === "home" && (
        <svg {...iconProps}>
          <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
        </svg>
      )}
      {variant === "plan" && (
        <svg {...iconProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
      )}
      {variant === "my" && (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      )}
      <span
        className={`text-[11px] leading-none ${
          isActive ? "font-bold" : "font-medium"
        }`}
      >
        {TAB_CONFIG[variant].label}
      </span>
    </div>
  );
};
