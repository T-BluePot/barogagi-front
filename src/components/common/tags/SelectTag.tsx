import { XMarkIcon } from "@heroicons/react/24/outline";

interface SelectTagProps {
  label: string;
  hasHash?: boolean;
  onClick: () => void;
}
export const SelectTag = ({
  label,
  hasHash = true,
  onClick,
}: SelectTagProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-[20px] px-[14px] py-[10px] border border-gray-black gap-1"
    >
      {hasHash && <span className="text-gray-black typo-caption">#</span>}
      <span className="text-gray-black typo-caption">{label}</span>
      <XMarkIcon className="h-4 w-4 text-gray-black cursor-pointer" />
    </button>
  );
};
