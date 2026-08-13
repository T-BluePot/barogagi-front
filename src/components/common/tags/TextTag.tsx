import clsx from "clsx";

type Size = "default" | "large";

interface TextTagProps {
  size?: Size;
  label: string;
  hasHash?: boolean;
}

export const TextTag = ({
  size = "default",
  label,
  hasHash = true,
}: TextTagProps) => {
  const textClass = clsx(
    size === "default" && "text-gray-40 typo-tag",
    size === "large" && "text-gray-80 typo-body"
  );

  return (
    // 태그는 절대 두 줄로 접히지 않는다 (줄 넘김은 컨테이너의 flex-wrap 이 담당).
    // 한 태그가 한 줄을 통째로 넘길 만큼 길면 말줄임으로 잘라 레이아웃을 지킨다.
    <div className="flex shrink-0 max-w-full justify-center items-center gap-0.5 whitespace-nowrap">
      {hasHash && <span className={clsx(textClass, "shrink-0")}>#</span>}
      <span className={clsx(textClass, "min-w-0 truncate")}>{label}</span>
    </div>
  );
};
