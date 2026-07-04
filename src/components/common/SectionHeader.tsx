interface SectionHeaderProps {
  title: string;
  /** 우측 액션 텍스트 (예: "전체보기", "+ 추가") — onAction과 함께 지정 시 노출 */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * 섹션 헤더 공통 컴포넌트
 * - 좌측 타이틀(17px 700)과 우측 액션 텍스트(12px 500 코랄)를 baseline 정렬
 */
const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => {
  return (
    <div className="mb-3 flex w-full items-baseline justify-between">
      <h2 className="text-[17px] font-bold tracking-[-0.02em] text-gray-black">
        {title}
      </h2>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-medium text-peach-text"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
