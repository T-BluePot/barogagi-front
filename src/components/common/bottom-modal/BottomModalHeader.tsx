type BottomModalHeaderVariant = "title" | "actions" | "detail";

interface BottomModalHeaderProps {
  variant: BottomModalHeaderVariant;
  title: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const BottomModalHeader = ({
  variant,
  title,
  onCancel,
  onConfirm,
}: BottomModalHeaderProps) => {
  return (
    <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
      {variant !== "title" && (
        <button onClick={onCancel} className="typo-subtitle text-gray-60">
          취소
        </button>
      )}
      <span className="typo-title-02 text-gray-black">{title}</span>
      {variant !== "title" && (
        <button onClick={onConfirm} className="typo-subtitle text-gray-black">
          확인
        </button>
      )}
    </div>
  );
};
