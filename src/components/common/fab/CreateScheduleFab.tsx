import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";

/**
 * 새 일정 생성 FAB (플로팅 액션 버튼)
 * - DESIGN.md 레시피: 56px 원, peach 배경, 글로우 섀도, 탭바 위 오른쪽(bottom 104px / right 24px)
 * - 프레스 시 배경만 peach-active로 전환 (120ms, 스케일/바운스 금지)
 */
const CreateScheduleFab = () => {
  const { startScheduleCreation } = useStartScheduleCreation();

  return (
    <button
      type="button"
      aria-label="새 일정 만들기"
      onClick={startScheduleCreation}
      className="fixed right-6 bottom-[calc(104px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-peach text-white shadow-[0_10px_24px_rgba(255,138,101,0.55)] transition-colors duration-120 ease-fitpl active:bg-peach-active"
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
};

export default CreateScheduleFab;
