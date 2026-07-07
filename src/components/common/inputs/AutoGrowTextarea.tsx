import { useLayoutEffect, useRef } from "react";
import clsx from "clsx";

interface AutoGrowTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

/**
 * 내용에 맞춰 높이가 자동으로 늘어나는 여러 줄 입력 textarea.
 * - value가 바뀔 때마다 scrollHeight 기준으로 높이를 재계산해 줄 수에 비례해 늘어난다.
 * - 최소 높이는 className의 min-h-* 로 지정(빈 값일 때 높이 유지).
 * - 세로 스크롤바/리사이즈 핸들은 숨김.
 */
const AutoGrowTextarea = ({
  value,
  onChange,
  placeholder,
  maxLength,
  className,
  ariaLabel,
  autoFocus,
  onBlur,
  onClick,
}: AutoGrowTextareaProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // 값이 바뀔 때마다 높이를 콘텐츠에 맞춤 (auto로 리셋 후 scrollHeight로 확정)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onClick={onClick}
      placeholder={placeholder}
      aria-label={ariaLabel}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={clsx("block w-full resize-none overflow-hidden", className)}
    />
  );
};

export default AutoGrowTextarea;
