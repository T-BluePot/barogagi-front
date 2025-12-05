import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import clsx from "clsx";

export interface SearchInputProps {
  searchPlaceholder: string;
  value: string;
  setValue: (next: string) => void;
  onClearSearchInput: () => void;
}

export const SearchInput = ({
  searchPlaceholder,
  value,
  setValue,
  onClearSearchInput,
}: SearchInputProps) => {
  const inputClass = clsx(
    "flex items-center w-full h-12 px-4 border rounded-xl bg-gray-white",
    value ? "border-gray-black" : "border-gray-20"
  );

  return (
    <div className={inputClass}>
      <input
        type="search"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none typo-caption"
      />
      {!value ? (
        <SearchIcon className="text-gray-80" />
      ) : (
        <button
          type="button"
          aria-label="검색창 초기화"
          onClick={onClearSearchInput}
        >
          <CancelIcon className="text-gray-20 cursor-pointer" />
        </button>
      )}
    </div>
  );
};
