import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import clsx from "clsx";

interface BackHeaderProps {
  label?: string;
  onClick: () => void;
  isHeaderDark?: boolean;
  children?: React.ReactNode;
}

export const BackHeader = ({
  isHeaderDark = false,
  label,
  onClick,
  children,
}: BackHeaderProps) => {
  const colorClass = clsx(isHeaderDark ? "text-gray-white" : "text-gray-black");
  return (
    <header className="flex flex-row px-6 w-full h-16 justify-between items-center gap-4 select-none">
      <div className="flex flex-row gap-6 items-center">
        <ArrowBackIosNewIcon
          className={clsx("cursor-pointer", colorClass)}
          sx={{
            fontSize: 20,
          }}
          onClick={onClick}
        />
        {label && (
          <span className={clsx("typo-title-02", colorClass)}>{label}</span>
        )}
      </div>
      {children && <div className="flex-1">{children}</div>}
    </header>
  );
};
