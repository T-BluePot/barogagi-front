import { useScrollStep } from "./useScrollStep";

/** 위아래 이전/이후 값 미리보기 표시 여부 (언제든 토글 가능) */
const SHOW_ADJACENT = true;

const pad2 = (v: string) => v.padStart(2, "0");

interface ScrollableTimeFieldProps {
  /** 현재 값 (시/분은 표시용 원본, 오전·오후는 그대로) */
  value: string;
  /** 순환/이동에 사용할 값 목록 (2자리 0패딩 기준) */
  items: string[];
  /** 값이 바뀔 때 호출 */
  onChange: (value: string) => void;
  /** 스크린리더용 라벨 */
  ariaLabel: string;
  /** 끝에서 다음으로 넘어갈 때 순환할지 (시/분: true) */
  wrap?: boolean;
  /** 탭하면 키패드로 직접 입력 가능 여부 (오전/오후는 false) */
  editable?: boolean;
  /** 키패드 입력값 검증 (유효하면 정제값, 아니면 null) */
  validate?: (raw: string) => string | null;
  /** 칸 너비 클래스 */
  widthClass?: string;
}

/**
 * 기존 입력칸 UI를 유지하면서
 * - 휠(데스크톱)·세로 드래그(모바일) 스크롤로 값 증감
 * - 탭하면 직접 입력(editable)
 * - 위아래로 이전/이후 값을 흐릿하게 미리보기
 * 를 지원하는 시간 칸 컴포넌트
 */
export const ScrollableTimeField = ({
  value,
  items,
  onChange,
  ariaLabel,
  wrap = true,
  editable = false,
  validate,
  widthClass = "w-12",
}: ScrollableTimeFieldProps) => {
  const scrollProps = useScrollStep({
    items,
    value: pad2(value),
    onChange,
    wrap,
  });

  const index = items.indexOf(pad2(value));
  const adjacent = (offset: number): string => {
    if (index === -1) return "";
    let i = index + offset;
    if (wrap) i = (i + items.length) % items.length;
    return items[i] ?? "";
  };

  const prevValue = adjacent(-1);
  const nextValue = adjacent(1);

  return (
    <div
      className={`flex flex-col items-center gap-1.5 ${widthClass}`}
      {...scrollProps}
    >
      {SHOW_ADJACENT && (
        <button
          type="button"
          disabled={!prevValue}
          aria-label={`${ariaLabel} 이전 값`}
          onClick={() => prevValue && onChange(prevValue)}
          className="typo-caption flex h-5 items-center justify-center text-gray-30 select-none cursor-pointer disabled:cursor-default touch-none"
        >
          {prevValue}
        </button>
      )}

      {editable ? (
        <input
          type="text"
          inputMode="numeric"
          value={value}
          aria-label={ariaLabel}
          onChange={(e) => {
            const validated = validate ? validate(e.target.value) : e.target.value;
            if (validated !== null) onChange(validated);
          }}
          // 18px는 디자인 토큰에 없어 이 시간 피커에서만 예외적으로 지정 (굵기 600 = font-semibold)
          className={`text-[18px] font-semibold text-gray-black ${widthClass} text-center bg-transparent outline-none touch-none`}
          maxLength={2}
          placeholder="00"
        />
      ) : (
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={() => onChange(items.find((i) => i !== value) ?? value)}
          className="text-[18px] font-semibold text-gray-black cursor-pointer touch-none"
        >
          {value}
        </button>
      )}

      {SHOW_ADJACENT && (
        <button
          type="button"
          disabled={!nextValue}
          aria-label={`${ariaLabel} 다음 값`}
          onClick={() => nextValue && onChange(nextValue)}
          className="typo-caption flex h-5 items-center justify-center text-gray-30 select-none cursor-pointer disabled:cursor-default touch-none"
        >
          {nextValue}
        </button>
      )}
    </div>
  );
};

export default ScrollableTimeField;
