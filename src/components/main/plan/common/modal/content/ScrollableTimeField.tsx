import { useEffect, useRef, useState } from "react";

/** 한 칸(항목) 높이(px). 3칸이 보이도록 컨테이너 높이를 이 값의 3배로 잡는다 */
const ITEM_HEIGHT = 26;
/** 위/아래 미리보기 1칸씩 포함해 보이는 칸 수 */
const VISIBLE_COUNT = 3;
/** 스크롤이 멈췄다고 판단할 시간(ms) — 이 시간 동안 추가 스크롤이 없으면 값 커밋 */
const SETTLE_MS = 120;
/** 이만큼 넘게 스크롤됐으면 탭이 아니라 스와이프로 본다(스와이프 끝 click 무시용) */
const TAP_SLOP_PX = 4;
/** smooth 스크롤이 이 시간 안에 도착하지 않으면 즉시 위치를 맞춘다 */
const SMOOTH_FALLBACK_MS = 400;

const pad2 = (v: string) => v.padStart(2, "0");

interface ScrollableTimeFieldProps {
  /** 현재 값 (시/분은 표시용 원본, 오전·오후는 그대로) */
  value: string;
  /** 선택 가능한 값 목록 (2자리 0패딩 기준) */
  items: string[];
  /** 값이 바뀔 때 호출 — 스크롤이 멈춘 뒤에만 불린다 */
  onChange: (value: string) => void;
  /** 스크린리더용 라벨 */
  ariaLabel: string;
  /** 탭하면 키패드로 직접 입력 가능 여부 (오전/오후는 false) */
  editable?: boolean;
  /** 키패드 입력값 검증 (유효하면 정제값, 아니면 null) */
  validate?: (raw: string) => string | null;
  /** 칸 너비 클래스 */
  widthClass?: string;
}

/**
 * 시간 값을 고르는 휠 피커 한 칸.
 *
 * 관성·스냅을 직접 구현하지 않고 네이티브 스크롤에 맡긴다
 * (`overflow-y-scroll` + `scroll-snap-type: y mandatory`).
 * 브라우저가 플릭 관성과 스냅을 처리하므로 세게 휘두르면 그대로 미끄러진다.
 *
 * - 값 커밋은 스크롤이 멈춘 뒤(SETTLE_MS) 한 번만 — 스크롤 중엔 하이라이트만 따라간다
 * - 탭(스크롤 없이 클릭)하면 입력 모드로 바뀌어 숫자를 직접 칠 수 있다
 * - 외부에서 값이 바뀌면(예: 분 지름길 버튼) 해당 칸으로 부드럽게 스크롤한다
 * - 네이티브 스크롤이라 끝에서 순환(wrap)하지 않는다 — 00분/30분은 지름길 버튼으로 이동
 */
export const ScrollableTimeField = ({
  value,
  items,
  onChange,
  ariaLabel,
  editable = false,
  validate,
  widthClass = "w-12",
}: ScrollableTimeFieldProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  // 스크롤 시작 시점의 scrollTop — click 이 탭인지 스와이프 끝인지 구분용
  const pressTopRef = useRef(0);
  // 사용자가 굴리는 중인지 — 이때 외부 값 동기화가 개입하면 스크롤이 튄다
  const isUserScrollingRef = useRef(false);
  // 최초 위치 배치는 애니메이션 없이(즉시) 해야 모달 열릴 때 값이 흐르지 않는다
  const hasPositionedRef = useRef(false);

  const [isEditing, setIsEditing] = useState(false);
  const valueIndex = items.indexOf(pad2(value));
  // 스크롤 중 하이라이트용 — 커밋 전에도 중앙 칸이 바로 강조되도록 별도로 들고 있는다
  const [activeIndex, setActiveIndex] = useState(Math.max(0, valueIndex));

  const containerHeight = ITEM_HEIGHT * VISIBLE_COUNT;

  // 외부 값 → 스크롤 위치 동기화
  useEffect(() => {
    const el = listRef.current;
    if (!el || valueIndex < 0) return;

    const target = valueIndex * ITEM_HEIGHT;

    if (!hasPositionedRef.current) {
      el.scrollTop = target;
      hasPositionedRef.current = true;
      setActiveIndex(valueIndex);
      return;
    }
    // 사용자가 굴리는 중엔 개입하지 않는다 (자기 스크롤을 자기가 되돌리는 상황 방지)
    if (isUserScrollingRef.current) return;
    // 이미 같은 칸에 있으면 건드리지 않는다. 스냅이 소수점 오차를 남기는 경우가 있어
    // 픽셀이 아니라 칸 인덱스로 비교해야 미세한 되돌림(지터)이 생기지 않는다.
    if (Math.round(el.scrollTop / ITEM_HEIGHT) === valueIndex) return;

    el.scrollTo({ top: target, behavior: "smooth" });
    setActiveIndex(valueIndex);

    // 안전망: smooth 스크롤이 무시되는 환경(애니메이션 프레임이 돌지 않는 경우 등)에서는
    // 위치가 그대로 남아 하이라이트와 어긋난다. 잠시 뒤에도 도착하지 않았으면 즉시 맞춘다.
    const fallback = window.setTimeout(() => {
      if (isUserScrollingRef.current) return;
      if (Math.round(el.scrollTop / ITEM_HEIGHT) === valueIndex) return;
      el.scrollTop = target;
    }, SMOOTH_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [valueIndex, isEditing]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current != null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    isUserScrollingRef.current = true;

    const index = Math.min(
      items.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT))
    );
    setActiveIndex(index);

    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current);
    }
    // 멈춘 뒤에만 커밋 — 스크롤 도중 onChange 를 쏟으면 상위 보정 로직이 계속 재실행된다
    settleTimerRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
      const next = items[index];
      if (next != null && next !== pad2(value)) onChange(next);
    }, SETTLE_MS);
  };

  const handleClick = () => {
    if (!editable) return;
    const moved = Math.abs((listRef.current?.scrollTop ?? 0) - pressTopRef.current);
    // 스와이프가 끝나면서 발생한 click 은 입력 모드로 보지 않는다
    if (moved > TAP_SLOP_PX) return;
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = listRef.current;
    if (!el) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const delta = e.key === "ArrowDown" ? 1 : -1;
    const next = Math.min(
      items.length - 1,
      Math.max(0, (valueIndex < 0 ? 0 : valueIndex) + delta)
    );
    el.scrollTo({ top: next * ITEM_HEIGHT, behavior: "smooth" });
    onChange(items[next]);
  };

  // 입력 모드: 스크롤 리스트 자리에 같은 크기의 입력칸을 놓는다
  if (isEditing) {
    return (
      <div
        className={`flex items-center justify-center ${widthClass}`}
        style={{ height: containerHeight }}
      >
        <input
          type="text"
          inputMode="numeric"
          // 숫자 두 자리 입력이라 줄바꿈이 필요 없다 → 엔터 대신 '확인/완료' 키
          enterKeyHint="done"
          autoFocus
          value={value}
          aria-label={ariaLabel}
          maxLength={2}
          placeholder="00"
          onChange={(e) => {
            const validated = validate ? validate(e.target.value) : e.target.value;
            if (validated !== null) onChange(validated);
          }}
          onKeyDown={(e) => {
            // 숫자 입력이라 조합이 일어날 일은 거의 없지만, 키보드를 한글로 둔 채
            // 들어오는 경우가 있어 다른 입력들과 동일하게 가드를 둔다.
            if (e.nativeEvent.isComposing) return;
            if (e.key !== "Enter") return;
            e.preventDefault();
            e.currentTarget.blur();
          }}
          onBlur={() => {
            // 리스트로 돌아갈 때 확정된 값 위치로 즉시 배치
            hasPositionedRef.current = false;
            setIsEditing(false);
          }}
          // 18px는 디자인 토큰에 없어 이 시간 피커에서만 예외적으로 지정 (굵기 600 = font-semibold)
          className={`text-[18px] font-semibold text-gray-black ${widthClass} bg-transparent text-center outline-none`}
        />
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      onScroll={handleScroll}
      onPointerDown={() => {
        pressTopRef.current = listRef.current?.scrollTop ?? 0;
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // overscroll-contain: 끝까지 굴렸을 때 모달 본문이 따라 스크롤되지 않도록
      className={`hide-scrollbar snap-y snap-mandatory select-none overflow-y-scroll overscroll-contain outline-none ${widthClass}`}
      style={{ height: containerHeight }}
    >
      {/* 위아래 1칸씩 여백을 줘야 첫/마지막 항목도 중앙에 올 수 있다 */}
      <div style={{ paddingTop: ITEM_HEIGHT, paddingBottom: ITEM_HEIGHT }}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item}
              role="option"
              aria-selected={isActive}
              style={{ height: ITEM_HEIGHT }}
              className={`flex snap-center items-center justify-center ${
                isActive
                  ? "text-[18px] font-semibold text-gray-black"
                  : "typo-caption text-gray-30"
              }`}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableTimeField;
