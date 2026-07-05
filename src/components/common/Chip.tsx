interface ChipProps {
  label: string;
  /** light: 흰 배경 위(피치 라이트) / onPeach: 피치 카드 위(반투명 화이트) / outline: 회색 보더 */
  tone?: "light" | "onPeach" | "outline";
  /** md: 12px(화이트 배경 기본) / sm: 11px(히어로 카드 위 등 좁은 영역) */
  size?: "md" | "sm";
}

const TONE_CLASS = {
  light: "bg-peach-light text-peach-text",
  onPeach: "bg-white/20 text-white",
  outline: "border border-gray-20 text-gray-70",
} as const;

const SIZE_CLASS = {
  md: "px-3 py-1.5 text-xs",
  sm: "px-2.5 py-1.5 text-[11px]",
} as const;

/** pill 형태의 칩/태그 공통 컴포넌트 */
const Chip = ({ label, tone = "light", size = "md" }: ChipProps) => {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full font-medium ${SIZE_CLASS[size]} ${TONE_CLASS[tone]}`}
    >
      {label}
    </span>
  );
};

export default Chip;
