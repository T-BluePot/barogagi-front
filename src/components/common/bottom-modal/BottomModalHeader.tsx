import type {
  BottomModalHeaderProps,
  TitleWithActionHeaderProps,
} from "@/types/BottomModalTypes";

export const BottomModalHeader = ({
  variant,
  title,
  onCancel,
  onConfirm,
}: BottomModalHeaderProps) => {
  return (
    <div className="flex h-16 items-center justify-between px-6">
      {variant !== "title" && (
        <button
          onClick={onCancel}
          className="typo-subtitle text-gray-60 cursor-pointer"
        >
          취소
        </button>
      )}
      <span className="typo-title-02 text-gray-black">{title}</span>
      {variant !== "title" && (
        <button
          onClick={onConfirm}
          className="typo-subtitle text-gray-black cursor-pointer"
        >
          확인
        </button>
      )}
    </div>
  );
};

export const BottomActionHeader = ({
  title,
  actionLabel,
  onClickAction,
}: TitleWithActionHeaderProps) => {
  return (
    <div className="flex h-16 items-center justify-between px-6">
      <span className="typo-title-02 text-gray-black">{title}</span>
      <button
        onClick={onClickAction}
        className="typo-subtitle text-gray-60 cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
};
