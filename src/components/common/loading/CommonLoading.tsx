import TypingText from "@/components/common/TypingText";

interface CommonLoadingProps {
  /** 로딩 메시지 (선택). 배열이면 타이핑 효과로 순환한다. */
  message?: string | string[];
  /** 순환 문구일 때 스크린리더에 읽힐 고정 문구 */
  srMessage?: string;
  /** 어두운 배경 위에서 사용 시 true */
  dark?: boolean;
}

/**
 * 공통 로딩 컴포넌트
 * - 메인 컬러 기반 스피너(48px) + 선택적 메시지
 * - 페이지 전체 또는 섹션 내부에서 사용 가능
 */
const CommonLoading = ({
  message,
  srMessage,
  dark = true,
}: CommonLoadingProps) => {
  const textClass = `typo-body ${dark ? "text-gray-white" : "text-gray-70"}`;

  return (
    <div className="flex flex-col h-full w-full justify-center items-center gap-3">
      {/* 감소 모션에서는 회전을 멈춘다. 마법봉 생성은 최대 120초라 무한 회전이 오래 간다.
          문구(TypingText)가 계속 바뀌므로 멈춰도 "정지 화면"으로 보이지 않는다. */}
      <div className="w-12 h-12 rounded-full border-3 border-gray-10 border-t-main animate-spin motion-reduce:animate-none" />
      {Array.isArray(message) ? (
        <TypingText
          items={message}
          srLabel={srMessage}
          className={textClass}
        />
      ) : (
        message && <p className={textClass}>{message}</p>
      )}
    </div>
  );
};

export default CommonLoading;
