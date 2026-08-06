import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";

/**
 * 새 일정 생성 플로팅 액션 버튼
 * - 56px 원, peach 배경, 탭바 위 오른쪽(bottom 104px / right 24px)
 * - 프레스 시 배경만 peach-active로 전환 (120ms, 스케일/바운스 금지)
 */
const CreateScheduleActionButton = () => {
  const { startScheduleCreation } = useStartScheduleCreation();

  return (
    <button
      type="button"
      aria-label="새 일정 만들기"
      onClick={startScheduleCreation}
      // 치수는 globals.css 의 --fab-* 토큰을 쓴다. 콘텐츠 하단 여백(.pb-tabbar)이
      // 같은 토큰으로 계산되므로, 여기서 크기를 바꾸면 여백도 같이 따라온다.
      className="fixed right-[max(24px,calc(50vw-var(--app-max-width)/2+24px))] bottom-[calc(var(--fab-bottom)+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-30 flex h-[var(--fab-size)] w-[var(--fab-size)] items-center justify-center rounded-full bg-peach text-white shadow-[0_2px_10px_var(--tw-shadow-color,rgba(255,138,101,0.45))] transition-colors duration-120 ease-fitpl active:bg-peach-active"
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

export default CreateScheduleActionButton;
