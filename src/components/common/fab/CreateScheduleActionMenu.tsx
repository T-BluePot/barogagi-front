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
 */
const CreateScheduleActionMenu = ({
  open,
  onClose,
  items,
}: CreateScheduleActionMenuProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-black/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
        />

        <motion.ul
          role="menu"
          aria-label="일정 만들기 방식"
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

export default CreateScheduleActionMenu;
