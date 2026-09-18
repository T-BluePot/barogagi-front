import { useState } from "react";
import { motion } from "framer-motion";

import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import CreateScheduleActionMenu from "./CreateScheduleActionMenu";

/** 일정 만들기 — 달력 + 플러스 */
const CalendarPlusIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x={3}
      y={5}
      width={18}
      height={16}
      rx={3}
      stroke="currentColor"
      strokeWidth={1.8}
    />
    <path
      d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </svg>
);

/** 마법봉으로 만들기 — 지팡이 + 반짝임 */
const MagicWandIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4.5 19.5 15 9"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="m14 7.5 2.5-2.5 2.5 2.5-2.5 2.5z"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path
      d="M7 4v3M5.5 5.5h3M19 14v2.5M17.75 15.25h2.5"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 새 일정 생성 플로팅 액션 버튼
 * - 56px 원, peach 배경, 탭바 위 오른쪽(bottom 104px / right 24px)
 * - 탭하면 생성 방식 메뉴가 뜨고, 아이콘은 + → × 로 회전 전환
 */
const CreateScheduleActionButton = () => {
  const { startScheduleCreation } = useStartScheduleCreation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    {
      key: "normal",
      label: "일정 만들기",
      icon: <CalendarPlusIcon />,
      onClick: () => {
        closeMenu();
        startScheduleCreation("NORMAL");
      },
    },
    {
      key: "magic",
      label: "마법봉으로 만들기",
      icon: <MagicWandIcon />,
      onClick: () => {
        closeMenu();
        startScheduleCreation("MAGIC");
      },
    },
  ];

  return (
    <>
      <CreateScheduleActionMenu
        open={isMenuOpen}
        onClose={closeMenu}
        items={menuItems}
      />

      <button
        type="button"
        aria-label={isMenuOpen ? "메뉴 닫기" : "새 일정 만들기"}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        // 치수는 globals.css 의 --fab-* 토큰을 쓴다. 콘텐츠 하단 여백(.pb-tabbar)이
        // 같은 토큰으로 계산되므로, 여기서 크기를 바꾸면 여백도 같이 따라온다.
        // 메뉴(z-40)보다 위에 떠야 × 아이콘을 다시 누를 수 있으므로 z-50.
        className="fixed right-[max(24px,calc(50vw-var(--app-max-width)/2+24px))] bottom-[calc(var(--fab-bottom)+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-50 flex h-[var(--fab-size)] w-[var(--fab-size)] items-center justify-center rounded-full bg-peach text-white shadow-[0_2px_10px_var(--tw-shadow-color,rgba(255,138,101,0.45))] transition-colors duration-120 ease-fitpl active:bg-peach-active"
      >
        <motion.svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          animate={{ rotate: isMenuOpen ? 135 : 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <path d="M12 5v14M5 12h14" />
        </motion.svg>
      </button>
    </>
  );
};

export default CreateScheduleActionButton;
