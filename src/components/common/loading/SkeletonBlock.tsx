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
 * - 회색 배경 위를 흰 띠가 좌→우로 지나간다.
 * - 띠의 색·폭·속도는 globals.css 의 `.skeleton-shimmer` 가 갖는다.
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
      <div className="skeleton-shimmer absolute top-0 left-0 h-full w-full" />
    </div>
  );
};

export default SkeletonBlock;
