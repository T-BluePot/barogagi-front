interface ChipProps {
  label: string;
  /** light: 흰 배경 위(피치 라이트) / onPeach: 피치 카드 위(반투명 화이트) / outline: 회색 보더 */
  tone?: "light" | "onPeach" | "outline";
}

const TONE_CLASS = {
  light: "bg-peach-light text-peach-text",
  onPeach: "bg-white/20 text-white",
  outline: "border border-gray-20 text-gray-70",
} as const;

/** pill 형태의 칩/태그 공통 컴포넌트 */
const Chip = ({ label, tone = "light" }: ChipProps) => {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-medium ${TONE_CLASS[tone]}`}
    >
      {label}
    </span>
  );
};

export default Chip;
