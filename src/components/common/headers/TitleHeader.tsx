import clsx from "clsx";

interface TitleHeaderProps {
  label: string;
  isDarkBg?: boolean;
}

export const TitleHeader = ({ isDarkBg = false, label }: TitleHeaderProps) => {
  const colorClass = clsx(isDarkBg ? "text-gray-white" : "text-gray-black");
  return (
    <header className="flex w-screen h-header items-center px-screen gap-lg">
      <span className={clsx("typo-title-01", colorClass)}>{label}</span>
    </header>
  );
};
