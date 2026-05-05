import clsx from "clsx";

interface SkeletonBlockProps {
  /** 너비 (Tailwind 클래스) */
  width?: string;
  /** 높이 (Tailwind 클래스) */
  height?: string;
  /** 모서리 둥글기 (Tailwind 클래스) */
  rounded?: string;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 공통 스켈레톤 블록
 * - 회색 배경 위에 흰색 사선 그라데이션이 좌→우로 이동하는 shimmer 효과
 */
const SkeletonBlock = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
  className,
}: SkeletonBlockProps) => {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-gray-10",
        width,
        height,
        rounded,
        className
      )}
    >
      <div
        className="absolute top-0 left-0 h-full w-full animate-shimmer"
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, var(--color-gray-white) 50%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default SkeletonBlock;
