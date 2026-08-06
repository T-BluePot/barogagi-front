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
  titlePlaceholder = false,
  actionLabel,
  onClickAction,
  onClickTitle,
}: TitleWithActionHeaderProps) => {
  const titleClassName = titlePlaceholder
    ? "text-title-02 font-normal text-gray-30" // 이름 미입력: 회색 + 얇게
    : "typo-title-02 text-gray-black";

  return (
    <div className="flex h-16 items-center justify-between px-6">
      {/* 우측 액션 링크가 작아서 잘 안 눌린다 → 제목 편집이 가능한 모달에서는 제목도 히트 영역으로 준다.
          onClickTitle 을 넘기지 않은 모달에서는 그냥 텍스트로 남는다. */}
      {onClickTitle ? (
        <button
          type="button"
          onClick={onClickTitle}
          aria-label={actionLabel ? `${title} · ${actionLabel}` : title}
          className={`${titleClassName} min-w-0 cursor-pointer truncate text-left`}
        >
          {title}
        </button>
      ) : (
        <span className={`${titleClassName} min-w-0 truncate`}>{title}</span>
      )}
      {actionLabel && (
        <button
          type="button"
          onClick={onClickAction}
          className="typo-caption text-gray-60 shrink-0 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
