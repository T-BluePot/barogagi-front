import { useRef } from "react";
import clsx from "clsx";
import CancelIcon from "@mui/icons-material/Cancel";

interface ScheduleTitleInputProps {
  scheduleName: string; // 일정명
  setScheduleName: (name: string) => void; // 일정명 변경 함수

  setEditMode: (mode: boolean) => void; // 편집 모드 설정 함수
}

const ScheduleTitleInput = ({
  scheduleName,
  setScheduleName,
  setEditMode,
}: ScheduleTitleInputProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputClass = `border-0 focus:ring-0 focus:outline-none w-full`;
  const inputFontClass = `typo-title-01`;
  const inputPlaceholder = `placeholder:text-xl placeholder-gray-30`;

  return (
    <div
      ref={wrapperRef}
      className="relative flex w-full justify-between items-center px-1 py-2 border-b border-gray-40 focus:outline-none"
      onBlur={(e) => {
        // 포커스가 벗어났을 때 (단, 내부의 다른 요소로 이동하는 경우는 제외)
        const relatedTarget = e.relatedTarget as Node | null;

        if (relatedTarget && wrapperRef.current?.contains(relatedTarget)) {
          // 포커스가 내부의 다른 요소로 이동한 경우는 무시
          return;
        }
        // 사용자가 일정명을 비우지 않도록 기본값 설정
        if (scheduleName.trim() === "") {
          setScheduleName("오늘의 일정");
        }
        setEditMode(false);
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className={clsx(inputClass, inputFontClass, inputPlaceholder)}
        placeholder="일정에 어울리는 제목을 지어볼까요?"
        value={scheduleName}
        onChange={(e) => {
          setScheduleName(e.target.value);
        }}
        autoFocus
      />
      <button
        type="button"
        aria-label="일정명 삭제"
        onClick={(e) => {
          e.preventDefault();
          setScheduleName("");
          inputRef.current?.focus(); // 입력창에 포커스 유지
        }}
        className="absolute right-1"
      >
        <CancelIcon className="!text-[16px] !text-gray-black" />
      </button>
    </div>
  );
};

export default ScheduleTitleInput;
