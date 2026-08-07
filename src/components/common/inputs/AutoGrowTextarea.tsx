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
 *   (한글 IME 대응 위해 maxLength 속성 대신 onChange/조합완료 시점에서 직접 잘라내며 감지)
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
  // IME(한글 등) 조합 중 여부 — 조합 중엔 잘라내지 않아야 입력이 깨지지 않음
  const composingRef = useRef(false);

  // 값이 바뀔 때마다 높이를 콘텐츠에 맞춤 (auto로 리셋 후 scrollHeight로 확정)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    // box-sizing: border-box라 scrollHeight(콘텐츠+패딩)에 상하 border를 더해야
    // 콘텐츠 영역이 위아래 대칭으로 딱 맞음(안 더하면 하단이 border 두께만큼 눌려 보임)
    const cs = getComputedStyle(el);
    const borderY =
      parseFloat(cs.borderTopWidth || "0") +
      parseFloat(cs.borderBottomWidth || "0");
    el.style.height = `${el.scrollHeight + borderY}px`;
  }, [value]);

  // 경고 애니메이션 재시작 (연속 입력에도 매번 재생되도록 클래스 제거→reflow→추가)
  const triggerWarn = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(WARN_CLASS);
    void el.offsetWidth; // 강제 reflow → 애니메이션 재시작
    el.classList.add(WARN_CLASS);
  };

  // 초과분을 잘라내고, 초과가 발생했으면 경고를 울린다
  const clampAndWarn = (raw: string): string => {
    if (maxLength == null || raw.length <= maxLength) return raw;
    triggerWarn();
    return raw.slice(0, maxLength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    // 경고 모드가 아니면 기존 동작 유지(maxLength 속성이 하드 스톱 담당)
    if (!warnOnMaxLength) {
      onChange(raw);
      return;
    }
    // 조합 중엔 그대로 반영(초과 여부는 compositionEnd에서 판정), 아니면 즉시 잘라내며 감지
    onChange(composingRef.current ? raw : clampAndWarn(raw));
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLTextAreaElement>
  ) => {
    composingRef.current = false;
    if (!warnOnMaxLength) return;
    // 한글 등 조합이 끝나는 시점에 최종 길이를 판정 → 초과면 자르고 경고
    onChange(clampAndWarn(e.currentTarget.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 IME 조합 중의 Enter 는 "입력 완료"가 아니라 "이 글자를 확정"이다.
    // 그것까지 편집 종료로 보면 마지막 글자를 확정하려는 순간 키보드가 닫힌다.
    // (warnOnMaxLength 여부와 무관하게 조합 중인지 판정해야 하므로 nativeEvent 로 확인)
    if (e.nativeEvent.isComposing) return;
    if (e.key !== "Enter") return;
    // 줄바꿈을 넣지 않고 편집을 끝낸다 → blur 로 키보드가 닫히고 onBlur 커밋이 돈다
    e.preventDefault();
    e.currentTarget.blur();
  };

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={warnOnMaxLength ? handleCompositionStart : undefined}
      onCompositionEnd={warnOnMaxLength ? handleCompositionEnd : undefined}
      onAnimationEnd={(e) => e.currentTarget.classList.remove(WARN_CLASS)}
      onBlur={onBlur}
      onClick={onClick}
      placeholder={placeholder}
      aria-label={ariaLabel}
      // 엔터 키 대신 '확인/완료' 키를 띄우고, 누르면 실제로 편집을 끝낸다(위 handleKeyDown).
      // 짧은 메모(≤50자)용 입력이라 줄바꿈보다 "완료로 닫기"가 기대 동작이다.
      enterKeyHint="done"
      // 경고 모드에선 직접 잘라내므로 속성 maxLength 제거(그래야 초과 입력이 onChange로 감지됨)
      maxLength={warnOnMaxLength ? undefined : maxLength}
      autoFocus={autoFocus}
      className={clsx("block w-full resize-none overflow-hidden", className)}
    />
  );
};

export default AutoGrowTextarea;
