import clsx from "clsx";

interface TitleHeaderProps {
  label: string;
  isDarkBg?: boolean;
}

export const TitleHeader = ({ isDarkBg = false, label }: TitleHeaderProps) => {
  const colorClass = clsx(isDarkBg ? "text-gray-white" : "text-gray-black");
  return (
    <header className="flex px-6 w-screen h-[60px] items-center px-screen gap-6 select-none">
      <span className={clsx("typo-title-02", colorClass)}>{label}</span>
    </header>
  );
};
