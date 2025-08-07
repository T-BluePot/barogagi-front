import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import clsx from "clsx";

export interface SearchInputProps {
  value: string;
  setValue: (next: string) => void;
  onClearSearchInput: () => void;
}

export const SearchInput = ({
  value,
  setValue,
  onClearSearchInput,
}: SearchInputProps) => {
  const inputClass = clsx(
    "flex items-center w-full px-4 py-2 border border-gray-20 rounded-xl bg-gray-white"
  );

  return (
    <div className={inputClass}>
      <input
        type="text"
        placeholder="시/군/구 로 검색해주세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none"
      />
      {!value ? (
        <SearchIcon className="text-gray-80 right-0" />
      ) : (
        <button aria-label="검색창 초기화" onClick={onClearSearchInput}>
          <CancelIcon className="text-gray-40 !text-[16px] right-0 cursor-pointer" />
        </button>
      )}
    </div>
  );
};
