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
/** 순환용으로 목록을 몇 벌 이어 붙일지 (가운데 벌을 기준 벌로 쓴다) */
const WRAP_COPIES = 3;

const pad2 = (v: string) => v.padStart(2, "0");

/** 렌더 목록(순환용 복제 포함) 기준 인덱스 → 실제 값 인덱스 */
const toRealIndex = (displayIndex: number, count: number) =>
  ((displayIndex % count) + count) % count;

interface ScrollableTimeFieldProps {
  /** 현재 값 (시/분은 표시용 원본, 오전·오후는 그대로) */
  value: string;
  /** 선택 가능한 값 목록 (2자리 0패딩 기준) */
  items: string[];
  /**
   * 값이 바뀔 때 호출 — 스크롤이 멈춘 뒤에만 불린다.
   * steps 는 이번 이동에서 몇 칸을 지났는지(부호 있음). 관성으로 여러 칸을 건너뛰면
   * 끝값만으로는 어떤 경계를 지났는지 알 수 없어, 경로가 필요한 쪽(시 → 오전/오후 전환)에서 쓴다.
   * 직접 입력처럼 경로가 없는 변경에서는 전달되지 않는다.
   */
  onChange: (value: string, steps?: number) => void;
  /** 스크린리더용 라벨 */
  ariaLabel: string;
  /** 끝에서 계속 굴리면 순환할지 (시/분: true, 오전·오후: false) */
  wrap?: boolean;
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
 * - wrap 이면 목록을 WRAP_COPIES 벌 이어 붙이고, 스크롤이 멈춘 뒤 가운데 벌의
 *   같은 값 칸으로 조용히 되돌린다(애니메이션 없이). 같은 내용이 이어져 있어
 *   사용자에겐 끊김 없이 무한히 도는 것으로 보인다.
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
  const listRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  // 스크롤 시작 시점의 scrollTop — click 이 탭인지 스와이프 끝인지 구분용
  const pressTopRef = useRef(0);
  // 사용자가 굴리는 중인지 — 이때 외부 값 동기화가 개입하면 스크롤이 튄다
  const isUserScrollingRef = useRef(false);
  // 최초 위치 배치는 애니메이션 없이(즉시) 해야 모달 열릴 때 값이 흐르지 않는다
  const hasPositionedRef = useRef(false);
  // 마지막으로 값을 반영한 칸 — 다음 반영 때 몇 칸을 지났는지(steps) 계산의 기준점
  const lastCommittedIndexRef = useRef(0);
  // 코드가 옮기는 스크롤인지(초기 배치·외부 값 반영·순환 되돌림).
  // 이 이동은 사용자 조작이 아니므로 중간 칸을 값으로 반영하면 안 된다.
  const isProgrammaticRef = useRef(false);

  const [isEditing, setIsEditing] = useState(false);

  const count = items.length;
  // 순환일 때 렌더 목록은 count * WRAP_COPIES 개, 기준(가운데) 벌의 시작 오프셋은 count
  const offset = wrap ? count : 0;
  const renderItems = wrap
    ? Array.from({ length: WRAP_COPIES }, () => items).flat()
    : items;

  const valueIndex = items.indexOf(pad2(value));

  // 스크롤 중 하이라이트용(렌더 목록 기준) — 커밋 전에도 중앙 칸이 바로 강조되도록
  const [activeIndex, setActiveIndex] = useState(
    offset + Math.max(0, valueIndex)
  );

  const containerHeight = ITEM_HEIGHT * VISIBLE_COUNT;

  // 외부 값 → 스크롤 위치 동기화
  useEffect(() => {
    const el = listRef.current;
    if (!el || valueIndex < 0) return;

    const target = (offset + valueIndex) * ITEM_HEIGHT;

    if (!hasPositionedRef.current) {
      hasPositionedRef.current = true;
      lastCommittedIndexRef.current = offset + valueIndex;
      setActiveIndex(offset + valueIndex);
      // 이미 목표 위치면 scroll 이벤트가 나지 않는다 → 플래그를 세우면 내려줄 사람이 없어
      // true 로 고착되고, pointerdown 이 없는 휠 조작의 첫 이동이 값으로 반영되지 않는다.
      // (오전/오후 칸은 오전일 때 목표가 0 이라 정확히 이 경우에 해당한다)
      if (el.scrollTop !== target) {
        isProgrammaticRef.current = true;
        el.scrollTop = target;
      }
      return;
    }
    // 사용자가 굴리는 중엔 개입하지 않는다 (자기 스크롤을 자기가 되돌리는 상황 방지)
    if (isUserScrollingRef.current) return;
    // 이미 같은 값 칸에 있으면 건드리지 않는다. 순환 때는 다른 벌의 같은 값일 수도 있어
    // 픽셀이 아니라 "실제 값 인덱스"로 비교해야 불필요한 되돌림(지터)이 생기지 않는다.
    if (toRealIndex(Math.round(el.scrollTop / ITEM_HEIGHT), count) === valueIndex) {
      return;
    }

    isProgrammaticRef.current = true;
    lastCommittedIndexRef.current = offset + valueIndex;
    el.scrollTo({ top: target, behavior: "smooth" });
    setActiveIndex(offset + valueIndex);

    // 안전망: smooth 스크롤이 무시되는 환경(애니메이션 프레임이 돌지 않는 경우 등)에서는
    // 위치가 그대로 남아 하이라이트와 어긋난다. 잠시 뒤에도 도착하지 않았으면 즉시 맞춘다.
    const fallback = window.setTimeout(() => {
      if (isUserScrollingRef.current) return;
      if (toRealIndex(Math.round(el.scrollTop / ITEM_HEIGHT), count) === valueIndex) {
        return;
      }
      el.scrollTop = target;
    }, SMOOTH_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [valueIndex, isEditing, offset, count]);

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

    const displayIndex = Math.min(
      renderItems.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT))
    );

    setActiveIndex(displayIndex);

    if (isProgrammaticRef.current) {
      // 코드가 옮기는 중 — 지나가는 칸을 값으로 반영하지 않고 기준점만 따라간다
      lastCommittedIndexRef.current = displayIndex;
    } else {
      isUserScrollingRef.current = true;
      // 굴리는 즉시 반영한다. 멈출 때까지 기다리면 값과 오전/오후가 뒤늦게 툭 바뀌어
      // 휠과 표시가 어긋나 보인다. 관성으로 프레임 사이에 여러 칸을 건너뛸 수 있으므로
      // 지나온 칸 수(steps)를 함께 넘겨, 경로가 필요한 쪽(오전/오후 전환)이 판단할 수 있게 한다.
      if (displayIndex !== lastCommittedIndexRef.current) {
        const steps = displayIndex - lastCommittedIndexRef.current;
        lastCommittedIndexRef.current = displayIndex;
        const next = items[toRealIndex(displayIndex, count)];
        // 값이 같아도 호출한다. 정확히 한 바퀴(예: 시 12칸) 움직이면 값은 그대로지만
        // 경계를 지났으므로 steps 를 전달해야 오전/오후 전환이 이뤄진다.
        // 위치가 바뀐 것은 이미 위 조건으로 확인했다.
        if (next != null) onChange(next, steps);
      }
    }

    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current);
    }
    // 멈춘 뒤에는 순환 되돌림만 담당한다 (값 반영은 위에서 이미 끝났다)
    settleTimerRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
      isProgrammaticRef.current = false;

      const realIndex = toRealIndex(displayIndex, count);

      // 순환: 바깥 벌에 멈췄으면 가운데 벌의 같은 값 칸으로 즉시(애니메이션 없이) 되돌린다.
      // 같은 내용이 이어져 있어 화면상 변화가 없고, 다음 플릭에서 다시 양쪽으로 굴릴 수 있다.
      if (wrap && (displayIndex < count || displayIndex >= count * 2)) {
        isProgrammaticRef.current = true;
        lastCommittedIndexRef.current = offset + realIndex;
        el.scrollTop = (offset + realIndex) * ITEM_HEIGHT;
        setActiveIndex(offset + realIndex);
      }
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
    const from = valueIndex < 0 ? 0 : valueIndex;
    const nextReal = wrap
      ? ((from + delta) % count + count) % count
      : Math.min(count - 1, Math.max(0, from + delta));

    // 값은 여기서 직접 반영하고, 스크롤은 따라오게만 한다
    isProgrammaticRef.current = true;
    lastCommittedIndexRef.current = offset + nextReal;
    el.scrollTo({ top: (offset + nextReal) * ITEM_HEIGHT, behavior: "smooth" });
    onChange(items[nextReal], delta);
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
        const el = listRef.current;
        pressTopRef.current = el?.scrollTop ?? 0;
        // 사용자가 손을 댄 순간부터는 사용자 조작이다.
        // (코드가 옮기던 중이었다면 그 이동을 여기서 끊고, 기준점을 현재 칸으로 맞춘다)
        isProgrammaticRef.current = false;
        if (el) {
          lastCommittedIndexRef.current = Math.round(el.scrollTop / ITEM_HEIGHT);
        }
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // overscroll-contain: 끝까지 굴렸을 때 모달 본문이 따라 스크롤되지 않도록
      className={`hide-scrollbar snap-y snap-mandatory select-none overflow-y-scroll overscroll-contain outline-none ${widthClass}`}
      style={{ height: containerHeight }}
    >
      {/* 위아래 1칸씩 여백을 줘야 첫/마지막 항목도 중앙에 올 수 있다 */}
      <div style={{ paddingTop: ITEM_HEIGHT, paddingBottom: ITEM_HEIGHT }}>
        {renderItems.map((item, index) => {
          const isActive = index === activeIndex;
          // 순환용 복제 벌은 스크린리더에서 중복 낭독되지 않도록 숨긴다
          const isDuplicate = wrap && (index < count || index >= count * 2);
          return (
            <div
              key={`${item}-${index}`}
              role={isDuplicate ? undefined : "option"}
              aria-selected={isDuplicate ? undefined : isActive}
              aria-hidden={isDuplicate || undefined}
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
