import { useRef } from "react";
import clsx from "clsx";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

import CancelIcon from "@mui/icons-material/Cancel";

type SizeType = "normal" | "small";

interface ScheduleTitleInputProps {
  scheduleName: string;
  setScheduleName: (name: string) => void;
  setEditMode: (mode: boolean) => void;
  onCommit?: (finalName: string) => void;
  placeholder?: string;
  size?: SizeType;
}

const ScheduleTitleInput = ({
  scheduleName,
  setScheduleName,
  setEditMode,
  onCommit,
  placeholder = ROUTES_CREATE_TEXT.HEADER.SCHEDULE_NAME_PLACEHOLDER,
  size = "normal",
}: ScheduleTitleInputProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputClass = `border-0 focus:ring-0 focus:outline-none w-full pr-6`;
  const inputFontClass = size === "normal" ? "typo-title-01" : "typo-subtitle";
  const inputPlaceholder =
    size === "normal"
      ? "placeholder:text-xl placeholder-gray-30"
      : "placeholder:text-base placeholder-gray-30";

  return (
    <div
      ref={wrapperRef}
      className="relative flex w-full h-12 justify-between items-center px-1 py-2 border-b border-gray-40 focus:outline-none"
      onBlur={(e) => {
        const relatedTarget = e.relatedTarget as Node | null;
        if (relatedTarget && wrapperRef.current?.contains(relatedTarget))
          return;

        const trimmedName = scheduleName.trim();
        const finalName =
          trimmedName === ""
            ? ROUTES_CREATE_TEXT.HEADER.DEFAULT_SCHEDULE_NAME
            : trimmedName;

        setScheduleName(finalName);
        setEditMode(false);
        onCommit?.(finalName);
      }}
    >
      <input
        ref={inputRef}
        type="text"
        // 한 줄 입력이라 줄바꿈이 필요 없다 → 엔터 대신 '확인/완료' 키를 띄운다.
        // 실제 완료 동작(blur)은 아래 onKeyDown 이 담당한다.
        enterKeyHint="done"
        className={clsx(inputClass, inputFontClass, inputPlaceholder)}
        placeholder={placeholder}
        value={scheduleName}
        onChange={(e) => setScheduleName(e.target.value)}
        onKeyDown={(e) => {
          // 한글 IME 조합 중의 Enter 는 "입력 완료"가 아니라 "이 글자를 확정"이다.
          // 일정명은 한글 입력이 대부분이라, 이 가드가 없으면 마지막 글자를 확정하려는
          // 순간 편집이 종료되고 키보드가 닫힌다.
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Enter") {
            setScheduleName(e.currentTarget.value);
            e.currentTarget.blur();
          }
        }}
        autoFocus
      />
      <button
        type="button"
        aria-label="일정명 삭제"
        onClick={(e) => {
          e.preventDefault();
          setScheduleName("");
          inputRef.current?.focus();
        }}
        className="absolute right-1"
      >
        <CancelIcon fontSize="small" className="!text-gray-black" />
      </button>
    </div>
  );
};

export default ScheduleTitleInput;
