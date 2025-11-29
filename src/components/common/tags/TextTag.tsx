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
    <div className="flex justify-center items-center gap-0.5">
      {hasHash && <span className={textClass}>#</span>}
      <span className={textClass}>{label}</span>
    </div>
  );
};
