interface CommonLoadingProps {
  /** 로딩 메시지 (선택) */
  message?: string;
  /** 스피너 크기 (px) */
  size?: number;
}

/**
 * 공통 로딩 컴포넌트
 * - 메인 컬러 기반 스피너 + 선택적 메시지
 * - 페이지 전체 또는 섹션 내부에서 사용 가능
 */
const CommonLoading = ({ message, size = 32 }: CommonLoadingProps) => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center gap-3">
      <div
        className="rounded-full border-3 border-gray-10 border-t-main animate-spin"
        style={{ width: size, height: size }}
      />
      {message && <p className="typo-body text-gray-70">{message}</p>}
    </div>
  );
};

export default CommonLoading;
