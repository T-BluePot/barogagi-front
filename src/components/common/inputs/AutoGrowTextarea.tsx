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
  /** true면 maxLength 도달 후 추가 입력 시도 시 흔들림 + 빨간 플래시 경고 */
  warnOnMaxLength?: boolean;
  onBlur?: () => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
}

const WARN_CLASS = "animate-memo-warn";

/**
 * 내용에 맞춰 높이가 자동으로 늘어나는 여러 줄 입력 textarea.
 * - value가 바뀔 때마다 scrollHeight 기준으로 높이를 재계산해 줄 수에 비례해 늘어난다.
 * - 최소 높이는 className의 min-h-* 로 지정(빈 값일 때 높이 유지).
 * - 세로 스크롤바/리사이즈 핸들은 숨김.
 * - warnOnMaxLength: 최대 글자수에서 더 입력하려 하면 경고 애니메이션 재생.
 */
const AutoGrowTextarea = ({
  value,
  onChange,
  placeholder,
  maxLength,
  className,
  ariaLabel,
  autoFocus,
  warnOnMaxLength,
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

  // 경고 애니메이션 재시작 (연속 입력에도 매번 재생되도록 클래스 제거→reflow→추가)
  const triggerWarn = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(WARN_CLASS);
    void el.offsetWidth; // 강제 reflow → 애니메이션 재시작
    el.classList.add(WARN_CLASS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!warnOnMaxLength || maxLength == null) return;
    if (e.nativeEvent.isComposing) return; // IME 조합 중 제외
    const el = e.currentTarget;
    const hasSelection = el.selectionStart !== el.selectionEnd; // 선택 후 대체 입력은 초과 아님
    const isInsertKey = e.key.length === 1 || e.key === "Enter"; // 문자/줄바꿈 입력만
    const withModifier = e.ctrlKey || e.metaKey || e.altKey;
    if (
      !withModifier &&
      isInsertKey &&
      !hasSelection &&
      value.length >= maxLength
    ) {
      triggerWarn();
    }
  };

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={warnOnMaxLength ? handleKeyDown : undefined}
      onAnimationEnd={(e) => e.currentTarget.classList.remove(WARN_CLASS)}
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
