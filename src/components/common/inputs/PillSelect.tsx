import type { ChangeEvent } from "react";

interface PillSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** 아이콘/짧은 텍스트만 있는 셀렉트라 반드시 지정 */
  ariaLabel: string;
  /** onPeach: 피치 카드 위(반투명 화이트) / light: 흰 배경 위(피치 라이트) */
  tone?: "onPeach" | "light";
}

const TONE_CLASS = {
  onPeach: "bg-white/20 text-white",
  light: "bg-peach-light text-peach-text",
} as const;

/**
 * pill 형태의 컴팩트 셀렉트 공통 컴포넌트
 * - 네이티브 <select>를 스타일링해 접근성/키보드 동작을 그대로 유지
 */
const PillSelect = ({
  value,
  options,
  onChange,
  ariaLabel,
  tone = "light",
}: PillSelectProps) => {
  return (
    <span className={`relative inline-flex items-center ${TONE_CLASS[tone]} rounded-full`}>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="appearance-none bg-transparent py-1.5 pl-3 pr-7 text-[11px] font-semibold text-inherit outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-black">
            {option}
          </option>
        ))}
      </select>
      {/* 커스텀 chevron (네이티브 화살표는 appearance-none으로 숨김) */}
      <svg
        width={10}
        height={10}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-2.5"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
};

export default PillSelect;
