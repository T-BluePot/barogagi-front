import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CreateScheduleActionMenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

interface CreateScheduleActionMenuProps {
  open: boolean;
  onClose: () => void;
  items: CreateScheduleActionMenuItem[];
}

/**
 * FAB 위로 떠오르는 일정 생성 옵션 메뉴.
 *
 * - dim 오버레이를 깔아 바깥 탭으로 닫는다(오버레이 자체가 닫기 버튼).
 * - 카드는 FAB 쪽(오른쪽 아래)을 기준점으로 스케일/페이드 인 — 바운스 없이 ease-fitpl 감각 유지.
 * - 위치 계산은 FAB 과 동일한 --fab-* 토큰을 쓴다. FAB 크기를 바꾸면 메뉴도 같이 따라온다.
 * - role="menu" 를 선언한 이상 키보드 계약도 같이 갖는다 — Esc 로 닫고, 위아래로 항목을
 *   옮기고, 열려 있는 동안 포커스가 뒤 페이지로 새지 않는다.
 */
const CreateScheduleActionMenu = ({
  open,
  onClose,
  items,
}: CreateScheduleActionMenuProps) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 열리면 첫 항목으로 포커스를 옮기고, 닫히면 열기 전 요소(FAB)로 되돌린다.
  // 되돌리지 않으면 메뉴가 사라진 자리에서 포커스가 문서 처음으로 튄다.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    itemRefs.current[0]?.focus();

    return () => previouslyFocused?.focus();
  }, [open]);

  // Esc 는 문서 레벨에서 듣는다. 메뉴 안에만 걸면 포커스가 빠져나간 뒤에는 안 먹는다.
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  /** 항목 간 포커스 이동 — 끝에서 반대쪽으로 순환한다 */
  const focusItemAt = (index: number) => {
    const count = items.length;
    if (count === 0) return;
    itemRefs.current[((index % count) + count) % count]?.focus();
  };

  const focusedIndex = () =>
    itemRefs.current.findIndex((el) => el === document.activeElement);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItemAt(focusedIndex() + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItemAt(focusedIndex() - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItemAt(0);
        break;
      case "End":
        e.preventDefault();
        focusItemAt(items.length - 1);
        break;
      case "Tab":
        // 떠 있는 동안에는 메뉴 안에서만 돈다. 막지 않으면 Tab 한 번에
        // 오버레이 뒤 페이지 콘텐츠로 빠져나가 메뉴만 덩그러니 남는다.
        e.preventDefault();
        focusItemAt(focusedIndex() + (e.shiftKey ? -1 : 1));
        break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="메뉴 닫기"
            onClick={onClose}
            // 탭 순서에서는 뺀다 — 키보드로는 Esc 가 닫기 담당이고,
            // 이게 순서에 남으면 항목 순환 중에 끼어든다.
            tabIndex={-1}
            className="fixed inset-0 z-40 bg-gray-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
          />

          <motion.ul
            role="menu"
            aria-label="일정 만들기 방식"
            onKeyDown={handleKeyDown}
            // FAB(56px) + 간격 12px 만큼 띄워 FAB 바로 위에 붙인다
            className="fixed right-[max(24px,calc(50vw-var(--app-max-width)/2+24px))] bottom-[calc(var(--fab-bottom)+var(--fab-size)+12px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-40 w-[208px] overflow-hidden rounded-2xl bg-gray-white shadow-popover"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
          >
            {items.map((item, index) => (
              <li key={item.key} role="none">
                <button
                  type="button"
                  role="menuitem"
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onClick={item.onClick}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-120 ease-fitpl active:bg-gray-10 ${
                    index > 0 ? "border-t border-gray-10" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach-light text-peach-text">
                    {item.icon}
                  </span>
                  <span className="typo-caption typo-strong text-gray-90">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateScheduleActionMenu;
